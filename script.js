const threshold = 50; // Reveal threshold percentage
const storeContentCheckbox = document.getElementById('storeContent'); // Store content toggle checkbox
const resetBtn = document.getElementById('resetBtn'); // Reset button

// Modal elements
let scratchModal;
let modalContainer;
let modalCanvas;
let modalHiddenImage;
let modalImageName;
let scratchInstruction;

// Initialize modal elements after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    scratchModal = new bootstrap.Modal(document.getElementById('scratchModal'));
    modalContainer = document.getElementById('modalScratchContainer');
    modalCanvas = document.getElementById('modalCanvas');
    modalHiddenImage = document.getElementById('modalHiddenImage');
    modalImageName = document.getElementById('modalImageName');
    scratchInstruction = modalContainer.querySelector('.scratch-instruction');
    
    // Add modal close event listener to reset state
    document.getElementById('scratchModal').addEventListener('hidden.bs.modal', () => {
        modalScratchInitialized = false;
        currentCardIndex = null;
        // Clear the canvas
        if (modalCanvas) {
            const ctx = modalCanvas.getContext('2d');
            ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
        }
        // Reset modal image name and instruction
        if (modalImageName) {
            modalImageName.style.opacity = 0;
            modalImageName.classList.remove('revealed');
        }
        if (scratchInstruction) {
            scratchInstruction.style.opacity = 0.7;
            scratchInstruction.style.display = 'block';
        }
        // Reset zoom functionality
        resetZoom();
    });
});

let currentCardIndex = null;
let modalScratchInitialized = false;
let isZoomed = false;
let zoomScale = 2.5;
let zoomOriginX = 0;
let zoomOriginY = 0;

// Initialize scratch card logic for each container
function initializeScratchCard(container, isModal = false) {
    const canvas = isModal ? modalCanvas : container.querySelector('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const revealKey = `scratchProgress`; // Key for storing array of scratch progress
    const hiddenImage = isModal ? modalHiddenImage : container.querySelector('.hidden-image'); // Hidden image element
    const cardIndex = isModal ? currentCardIndex : parseInt(container.dataset.id); // Index of the current card

    // Set canvas size to match the container
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    // Function to draw the initial overlay (gray scratchable area)
    function drawOverlay() {
        ctx.fillStyle = '#bbb';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Load previous progress if checkbox is enabled
    function loadProgress() {
        // Clear canvas first
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (storeContentCheckbox.checked) {
            const savedProgress = JSON.parse(localStorage.getItem(revealKey)) || [];
            const savedImageData = savedProgress[cardIndex]; // Retrieve progress for this card
            if (savedImageData) {
                const image = new Image();
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    // Check if this card is fully revealed
                    checkScratchProgress();
                    
                    // If card has progress, hide instruction immediately
                    if (isModal && scratchInstruction) {
                        scratchInstruction.style.opacity = 0;
                        scratchInstruction.style.display = 'none';
                    }
                };
                image.src = savedImageData;
            } else {
                drawOverlay();
            }
        } else {
            drawOverlay();
        }
    }

    let isScratching = false;
    let scratchedPixels = 0;

    // Adjust touch/mouse coordinates for canvas
    function getTouchPos(event) {
        const rect = canvas.getBoundingClientRect();
        const touch = event.touches[0] || event.changedTouches[0];
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }

    function getMousePos(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    // Start scratching
    function startScratching(event) {
        isScratching = true;
        
        // Hide the scratch instruction when user starts scratching
        if (isModal && scratchInstruction) {
            scratchInstruction.style.opacity = 0;
            scratchInstruction.style.pointerEvents = 'none';
        }
        
        // Show the image immediately when scratching starts for excitement!
        hiddenImage.style.opacity = 1;
        
        scratch(event);
    }

    function stopScratching() {
        isScratching = false;
        saveProgress();
    }

    function scratch(event) {
        if (!isScratching) return;

        let pos;
        if (event.touches) {
            pos = getTouchPos(event);
        } else {
            pos = getMousePos(event);
        }

        ctx.globalCompositeOperation = 'destination-out'; // Erase mode
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2, false); // Circular erase
        ctx.fill();
        checkScratchProgress();
    }

    // Check scratch progress
    function checkScratchProgress() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] === 0) transparentPixels++;
        }

        const percentage = (transparentPixels / (pixels.length / 4)) * 100;

        // Show image name progressively as user scratches (starts showing at 25% scratched)
        if (percentage >= 25) {
            if (isModal && modalImageName) {
                modalImageName.style.opacity = Math.min(1, (percentage - 25) / 25); // Fade in from 25% to 50%
            } else if (!isModal) {
                const imageName = container.querySelector('.image-name');
                if (imageName) {
                    imageName.style.opacity = Math.min(1, (percentage - 25) / 25); // Fade in from 25% to 50%
                }
            }
        }

        if (percentage >= threshold) {
            revealImage();
        }
    }

    // Reveal the hidden image and remove the scratchable layer
    function revealImage() {
        hiddenImage.style.opacity = 1; // Make the image visible
        canvas.style.display = 'none'; // Hide the canvas (erase/scratch layer)
        
        // Hide scratch instruction when fully revealed
        if (isModal && scratchInstruction) {
            scratchInstruction.style.display = 'none';
        }
        
        // Enable zoom functionality for modal images
        if (isModal) {
            enableZoomFunctionality();
            // For modal, show the modal image name
            if (modalImageName) {
                modalImageName.style.opacity = 1;
                modalImageName.classList.add('revealed');
            }
            // Also update the corresponding grid card
            updateGridCard(currentCardIndex);
        } else {
            // For grid cards, show the grid image name
            const imageName = container.querySelector('.image-name');
            if (imageName) {
                imageName.style.opacity = 1;
            }
        }
    }

    // Save current progress in an array format
    function saveProgress() {
        if (storeContentCheckbox.checked && cardIndex !== null && cardIndex !== undefined) {
            const savedProgress = JSON.parse(localStorage.getItem(revealKey)) || [];
            const imageDataURL = canvas.toDataURL();
            savedProgress[cardIndex] = imageDataURL; // Update the progress for this card
            localStorage.setItem(revealKey, JSON.stringify(savedProgress)); // Store the updated array
            
            // If this is modal scratching, update the corresponding grid card
            if (isModal && currentCardIndex !== null) {
                updateGridCard(currentCardIndex);
            }
        }
    }

    // Event listeners for mouse and touch events (only for modal)
    if (isModal) {
        canvas.addEventListener('mousedown', startScratching);
        canvas.addEventListener('mouseup', stopScratching);
        canvas.addEventListener('mouseleave', stopScratching);
        canvas.addEventListener('mousemove', scratch);

        canvas.addEventListener('touchstart', startScratching);
        canvas.addEventListener('touchend', stopScratching);
        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault(); // Prevent scrolling
            scratch(event);
        });
    }

    // Load progress on initialization
    loadProgress();
}

// Function to open modal with specific card
function openScratchModal(cardIndex, imageSrc, imageName) {
    console.log('Opening modal for:', cardIndex, imageName); // Debug log
    if (!scratchModal) {
        console.error('Modal not initialized');
        return;
    }
    
    currentCardIndex = cardIndex;
    
    // Set modal content
    modalHiddenImage.src = imageSrc;
    modalHiddenImage.alt = imageName;
    modalImageName.textContent = imageName.toUpperCase();
    
    // Reset modal state before showing
    modalHiddenImage.style.opacity = 0;
    modalCanvas.style.display = 'block';
    modalImageName.style.opacity = 0;
    modalImageName.classList.remove('revealed');
    
    // Reset zoom state
    resetZoom();
    
    // Show scratch instruction
    if (scratchInstruction) {
        scratchInstruction.style.opacity = 0.7;
        scratchInstruction.style.display = 'block';
        scratchInstruction.style.pointerEvents = 'none';
    }
    
    // Show modal first, then initialize canvas
    scratchModal.show();
    
    // Wait for modal to be fully shown before setting canvas size
    document.getElementById('scratchModal').addEventListener('shown.bs.modal', function initCanvas() {
        console.log('Modal shown, initializing canvas for card:', cardIndex); // Debug log
        
        // Clear any existing event listeners on the canvas
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'modalCanvas';
        modalCanvas.parentNode.replaceChild(newCanvas, modalCanvas);
        modalCanvas = newCanvas;
        
        // Reset modal canvas
        modalCanvas.width = modalContainer.offsetWidth;
        modalCanvas.height = modalContainer.offsetHeight;
        
        // Initialize scratch functionality for modal
        initializeScratchCard(modalContainer, true);
        modalScratchInitialized = true;
        
        // Remove this event listener after first use
        this.removeEventListener('shown.bs.modal', initCanvas);
    });
}

// Zoom functionality for revealed images
function enableZoomFunctionality() {
    if (!modalHiddenImage) return;
    
    // Remove any existing zoom event listeners
    modalHiddenImage.removeEventListener('click', handleImageZoom);
    
    // Add zoom event listener
    modalHiddenImage.addEventListener('click', handleImageZoom);
    
    // Change cursor to indicate zoom is available
    modalHiddenImage.style.cursor = 'zoom-in';
}

function handleImageZoom(event) {
    event.stopPropagation();
    
    if (!isZoomed) {
        // Zoom in
        const rect = modalHiddenImage.getBoundingClientRect();
        const containerRect = modalContainer.getBoundingClientRect();
        
        // Calculate click position relative to the image
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        
        // Calculate zoom origin as percentage
        zoomOriginX = (clickX / rect.width) * 100;
        zoomOriginY = (clickY / rect.height) * 100;
        
        // Apply zoom
        modalHiddenImage.style.transform = `scale(${zoomScale})`;
        modalHiddenImage.style.transformOrigin = `${zoomOriginX}% ${zoomOriginY}%`;
        modalHiddenImage.style.cursor = 'zoom-out';
        
        // Add zoom class for additional styling
        modalContainer.classList.add('zoomed');
        
        isZoomed = true;
    } else {
        // Zoom out
        modalHiddenImage.style.transform = 'scale(1)';
        modalHiddenImage.style.transformOrigin = 'center center';
        modalHiddenImage.style.cursor = 'zoom-in';
        
        // Remove zoom class
        modalContainer.classList.remove('zoomed');
        
        isZoomed = false;
    }
}

function resetZoom() {
    if (modalHiddenImage) {
        modalHiddenImage.style.transform = 'scale(1)';
        modalHiddenImage.style.transformOrigin = 'center center';
        modalHiddenImage.style.cursor = 'default';
        modalHiddenImage.removeEventListener('click', handleImageZoom);
    }
    
    if (modalContainer) {
        modalContainer.classList.remove('zoomed');
    }
    
    isZoomed = false;
}

// Add click event listeners to all col elements
function addColClickListeners() {
    document.querySelectorAll('.col').forEach((col, index) => {
        col.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Col clicked:', index); // Debug log
            const container = col.querySelector('.reveal-container');
            const img = container.querySelector('.hidden-image');
            const nameSpan = container.querySelector('.image-name');
            
            openScratchModal(index, img.src, nameSpan ? nameSpan.textContent : img.alt);
        });
    });
}

// Function to update a specific grid card visual
function updateGridCard(cardIndex) {
    const containers = document.querySelectorAll('.reveal-container');
    if (cardIndex < containers.length) {
        const container = containers[cardIndex];
        const canvas = container.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const hiddenImage = container.querySelector('.hidden-image');
        const imageName = container.querySelector('.image-name');
        
        // Check if this card has been scratched
        const savedProgress = JSON.parse(localStorage.getItem('scratchProgress')) || [];
        const savedImageData = savedProgress[cardIndex];
        
        if (storeContentCheckbox.checked && savedImageData) {
            // Load saved progress
            const image = new Image();
            image.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                
                // Check if fully revealed
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let transparentPixels = 0;
                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) transparentPixels++;
                }
                const percentage = (transparentPixels / (pixels.length / 4)) * 100;
                
                if (percentage >= threshold) {
                    hiddenImage.style.opacity = 1;
                    canvas.style.display = 'none';
                    if (imageName) {
                        imageName.style.opacity = 1;
                    }
                }
            };
            image.src = savedImageData;
        }
    }
}

// Function to initialize grid scratch cards (visual only, no interaction)
function initializeGridScratchCards() {
    document.querySelectorAll('.reveal-container').forEach((container, index) => {
        container.dataset.id = index;
        const canvas = container.querySelector('canvas');
        const ctx = canvas.getContext('2d');
        const hiddenImage = container.querySelector('.hidden-image');
        const imageName = container.querySelector('.image-name');
        
        // Set canvas size
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        
        // Reset image opacity and canvas display
        hiddenImage.style.opacity = 0;
        canvas.style.display = 'block';
        
        // Hide image name initially
        if (imageName) {
            imageName.style.opacity = 0;
        }
        
        // Check if this card has been scratched before
        const savedProgress = JSON.parse(localStorage.getItem('scratchProgress')) || [];
        const savedImageData = savedProgress[index];
        
        if (storeContentCheckbox.checked && savedImageData) {
            // Load saved progress
            const image = new Image();
            image.onload = () => {
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                
                // Check if fully revealed
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let transparentPixels = 0;
                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) transparentPixels++;
                }
                const percentage = (transparentPixels / (pixels.length / 4)) * 100;
                
                if (percentage >= threshold) {
                    hiddenImage.style.opacity = 1;
                    canvas.style.display = 'none';
                    if (imageName) {
                        imageName.style.opacity = 1;
                    }
                }
            };
            image.src = savedImageData;
        } else {
            // Draw initial scratch overlay
            ctx.fillStyle = '#bbb';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    });
}

// Listen for checkbox change to enable or disable saving scratch progress
storeContentCheckbox.addEventListener('change', () => {
    // Refresh grid scratch cards visual
    initializeGridScratchCards();
    
    // Reset modal scratch if it's initialized
    if (modalScratchInitialized && currentCardIndex !== null) {
        const ctx = modalCanvas.getContext('2d');
        ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
        ctx.fillStyle = '#bbb';
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
        initializeScratchCard(modalContainer, true);
    }
});

// Reset all stored scratch progress when the "Reset Scratch Cards" button is clicked
resetBtn.addEventListener('click', () => {
    const savedProgress = JSON.parse(localStorage.getItem('scratchProgress')) || [];
    savedProgress.forEach((_, index) => {
        savedProgress[index] = null; // Clear progress for each scratch card
    });
    localStorage.setItem('scratchProgress', JSON.stringify(savedProgress)); // Update the array
    
    // Reset grid scratch cards visual
    initializeGridScratchCards();
    
    // Reset modal scratch if it's currently open
    if (modalScratchInitialized && currentCardIndex !== null) {
        const ctx = modalCanvas.getContext('2d');
        ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
        ctx.fillStyle = '#bbb';
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
        modalHiddenImage.style.opacity = 0;
        modalCanvas.style.display = 'block';
        initializeScratchCard(modalContainer, true);
    }
});

























const imageFiles = [
    "69-bridge.jpg",
    "69-spooning.jpg",
    "69.png",
    "ankle-grab.jpg",
    "ballet-dancer.png",
    "barstool.jpg",
    "bathroomattendant.jpg",
    "belly-down.png",
    "bridge-position.jpg",
    "bubble-the-fun.png",
    "butter-churner.png",
    "butterchurner.jpg",
    "butterfly.jpg",
    "captain.jpg",
    "carsex.png", "champagne-room.jpg", "champagne-room.png",
    "circle-perk.png", "closedbusiness.jpg", "cold-hard-truth.jpg", "corkscrew.png", "couch-grind.png",
    "couchsurfer.jpg", "cowboy.png", "cowgirl-side.jpg", "cowgirl.jpg", "cross-booty.png", "davidscopperfield.jpg", "deep-doggy.jpg", "doggie-style-rear-entry.png", "doggy-style.jpg", "eagle.jpg", "edge-of-the-bed.jpg", "eiffel-tower.jpg", "face-off.png", "face-sitter.jpeg", "face-sitting.jpg", "faceoff.jpg", "flatiron.jpg", "flatiron.png", "folded-missionary.jpg", "g-whiz.png", "get-to-the-g-spot.png", "giftwrapped.jpg", "giraffe.jpg", "goldenarch.jpg", "gwhiz.jpg", "h2ohhyeah.jpg", "happybaby.jpg", "heirtothethrone.jpg", "hook.jpg", "hotseat.jpg", "hoveringbutterfly.jpg", "inverted-edit.jpg", "ironchef.jpg", "kneeling-dog.jpg", "lap-dance.jpg", "lazyman.jpg", "leap-frog.png", "leg-up.jpg", "legs-up.jpg", "littledipper.jpg", "look-and-learn.png", "lying-doggy.jpg", "magic-mountainat.jpg", "magicmountain.jpg", "mansbestfriend.jpg", "milking-table.jpg", "missionary-with-wedge.jpg", "missionary.jpg", "missionaryy.jpg", "modified-doggy.jpg", "mountainclimber.jpg", "mutual-masturbation.png", "on-the-counter.jpg", "oneup.jpg", "open-book.jpg", "open-legged-spoon.jpg", "oral-sex.jpg", "pearly-gates.jpg", "poleposition.jpg", "positions-spork.png", "pretzel.jpg", "prezel-dip.png", "quickerpickerupper.jpg", "quickiefix.jpg", "reverse-amazon.jpg", "reverse-cowgirl.jpg", "reverse-cowgirl.png", "reverse-missionary.jpg", "reverse-scoop.png", "scissors.jpg", "scoop-me-up.png", "seashell-final.jpg", "seated-wheelbarrow.png", "seatedwheelbarrow.jpg", "shower-dance.jpg", "showersex-table-top-copy-1.png", "showersex-table-top-copy-2.png", "showersex.png", "sideways.jpg", "sit-off.jpg", "sphinx.jpg", "spincycle.jpg", "spoo.jpeg", "spoonfacing.jpg", "spooning.jpg", "spork.jpg", "squatter.jpg", "stairwaytoheaven.jpg", "stand-and-deliver.jpg", "stand-and-deliver.png", "stand-deliver.jpg", "standing-69.jpg", "standing-missionary.jpg", "standing-wheelbarrow.jpg", "standingdragon.jpg", "standingo.jpg", "standingwheelbarrow.jpg", "supported-butterfly.jpg", "swing.jpg", "table-top.png", "take-a-seat.jpg", "tap-dance.png", "the-caboose.png", "the-chairman.png", "the-lazy-man.png", "the-om.png", "the-pinball-wizard.png", "the-seashell.png", "the-snake.png", "the-snow-angel.png", "the-spider.png", "the-x-position.png", "theballerina.jpg", "thecat.jpg", "theelevator.jpg", "thefusion.jpg", "thesnowangel.jpg", "thesocket.jpg", "thespider.jpg", "theswissballblitz.jpg", "thewaterfall.jpg", "thexposition.jpg", "threesome.png", "threesomee.png",
];

const containerRow = document.querySelector('.row');

// Clear existing content (if necessary)
containerRow.innerHTML = "";

// Dynamically create containers for each image
imageFiles.forEach((fileName, index) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col');

    const revealContainer = document.createElement('div');
    revealContainer.classList.add('reveal-container');
    revealContainer.setAttribute('data-id', index);

    // Extract the name of the image (excluding the extension)
    const imageName = fileName.replace(/\.[^/.]+$/, ""); // Removes the file extension

    const img = document.createElement('img');
    img.classList.add('hidden-image');
    // img.classList.add('img-fluid');
    img.setAttribute('src', `images/${fileName}`);
    img.setAttribute('alt', '${imageName}');

    // Create the span for the text
    const textSpan = document.createElement('span');
    textSpan.classList.add('image-name');
    textSpan.textContent = imageName.toUpperCase();

    // Create canvas for grid display (non-interactive)
    const canvas = document.createElement('canvas');

    // Append elements to container
    revealContainer.appendChild(img);
    revealContainer.appendChild(textSpan);
    revealContainer.appendChild(canvas);

    colDiv.appendChild(revealContainer);
    containerRow.appendChild(colDiv);
});

// Initialize everything after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize grid scratch cards (visual only)
    initializeGridScratchCards();
    // Add click listeners to dynamically created col elements
    addColClickListeners();
});