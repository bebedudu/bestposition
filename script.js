const threshold = 50; // Reveal threshold percentage
const storeContentCheckbox = document.getElementById('storeContent'); // Store content toggle checkbox
const resetBtn = document.getElementById('resetBtn'); // Reset button

// Initialize scratch card logic for each container
function initializeScratchCard(container) {
    const canvas = container.querySelector('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const revealKey = `scratchProgress`; // Key for storing array of scratch progress
    const hiddenImage = container.querySelector('.hidden-image'); // Hidden image element
    const cardIndex = parseInt(container.dataset.id); // Index of the current card

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
        if (storeContentCheckbox.checked) {
            const savedProgress = JSON.parse(localStorage.getItem(revealKey)) || [];
            const savedImageData = savedProgress[cardIndex]; // Retrieve progress for this card
            if (savedImageData) {
                const image = new Image();
                image.onload = () => ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
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

        if (percentage >= threshold) {
            revealImage();
        }
    }

    // Reveal the hidden image and remove the scratchable layer
    function revealImage() {
        hiddenImage.style.opacity = 1; // Make the image visible
        canvas.style.display = 'none'; // Hide the canvas (erase/scratch layer)
    }

    // Save current progress in an array format
    function saveProgress() {
        if (storeContentCheckbox.checked) {
            const savedProgress = JSON.parse(localStorage.getItem(revealKey)) || [];
            const imageDataURL = canvas.toDataURL();
            savedProgress[cardIndex] = imageDataURL; // Update the progress for this card
            localStorage.setItem(revealKey, JSON.stringify(savedProgress)); // Store the updated array
        }
    }

    // Event listeners for mouse and touch events
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

    // Load progress on initialization
    loadProgress();
}

// Initialize scratch cards for all containers
document.querySelectorAll('.reveal-container').forEach((container, index) => {
    container.dataset.id = index; // Assign unique IDs to containers
    initializeScratchCard(container);
});

// Listen for checkbox change to enable or disable saving scratch progress
storeContentCheckbox.addEventListener('change', () => {
    // Reload all scratch cards if the checkbox state changes
    document.querySelectorAll('.reveal-container').forEach((container) => {
        container.querySelector('canvas').getContext('2d').clearRect(0, 0, container.offsetWidth, container.offsetHeight);
        container.querySelector('canvas').getContext('2d').fillStyle = '#bbb';
        container.querySelector('canvas').getContext('2d').fillRect(0, 0, container.offsetWidth, container.offsetHeight);
        initializeScratchCard(container); // Reinitialize with the updated checkbox state
    });
});

// Reset all stored scratch progress when the "Reset Scratch Cards" button is clicked
resetBtn.addEventListener('click', () => {
    const savedProgress = JSON.parse(localStorage.getItem('scratchProgress')) || [];
    savedProgress.forEach((_, index) => {
        savedProgress[index] = null; // Clear progress for each scratch card
    });
    localStorage.setItem('scratchProgress', JSON.stringify(savedProgress)); // Update the array
    document.querySelectorAll('.reveal-container').forEach((container) => {
        container.querySelector('canvas').style.display = 'block';
        container.querySelector('canvas').getContext('2d').clearRect(0, 0, container.offsetWidth, container.offsetHeight);
        container.querySelector('canvas').getContext('2d').fillStyle = '#bbb';
        container.querySelector('canvas').getContext('2d').fillRect(0, 0, container.offsetWidth, container.offsetHeight);
        container.querySelector('.hidden-image').style.opacity = 0; // Hide the image
        initializeScratchCard(container); // Reinitialize scratch functionality
    });
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

    const canvas = document.createElement('canvas');

    // Append elements to container
    revealContainer.appendChild(img);
    revealContainer.appendChild(textSpan);
    // revealContainer.appendChild(svg);
    revealContainer.appendChild(canvas);

    colDiv.appendChild(revealContainer);
    containerRow.appendChild(colDiv);
});

// Reinitialize scratch cards dynamically after creating containers
document.querySelectorAll('.reveal-container').forEach((container, index) => {
    initializeScratchCard(container);
});