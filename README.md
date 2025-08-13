# 🎴 Interactive Scratch Cards - Best Position

A modern, interactive scratch card web application built with HTML5 Canvas, CSS3, and vanilla JavaScript. Features a beautiful dark theme UI with modal popups, progressive reveal animations, and advanced zoom functionality.

<!--Display Visitor Count-->
<p align="right"> <img src="https://komarev.com/ghpvc/?username=bebedudubestposition&label=Profile%20views&color=0e75b6&style=flat" alt="bebedudubestposition" /> </p>

## ✨ Features

### 🎯 Core Functionality
- **Interactive Scratch Cards**: Click and drag to scratch away the overlay
- **Modal Popup Interface**: Cards open in elegant dark-themed modals
- **Progressive Image Reveal**: Images appear immediately when scratching starts
- **Dynamic Image Name Display**: Names fade in progressively as you scratch
- **Persistent Progress**: Save and restore scratch progress with localStorage

### 🔍 Advanced Zoom System
- **Click-to-Zoom**: Click anywhere on revealed images to zoom 2.5x
- **Mouse Wheel Zoom**: Smooth scroll-to-zoom (1x to 4x range)
- **Smart Zoom Origin**: Zooms into exact cursor/click position
- **Smooth Transitions**: Professional 0.2s cubic-bezier animations

### 📱 Mobile Optimized
- **Responsive Design**: Adapts to all screen sizes
- **Touch-Friendly**: Larger scratch radius and touch targets on mobile
- **Full-Screen Modal**: Maximizes scratch area on small devices
- **Gesture Support**: Touch scrolling and interaction optimized

### 🎨 Beautiful UI/UX
- **Dark Theme**: Modern dark interface with blue accents
- **Animated Borders**: Glowing border effects and shimmer animations
- **Visual Feedback**: Hover effects, cursor changes, and smooth transitions
- **Professional Modal**: Glassmorphism effects and backdrop blur

## 🚀 Demo

[Live Demo](https://bebedudu.github.io/bestposition) - Try it yourself!

## 📸 Screenshots

### Desktop View
- Grid of circular scratch cards with hover effects
- Dark theme with professional styling
- Responsive layout adapting to screen size

### Mobile View
- Optimized modal size for touch interaction
- Larger scratch areas and touch targets
- Full-screen experience on small devices

### Modal Interface
- Elegant dark modal with animated borders
- Scratch instruction with pulsing animation
- Progressive reveal of image and name

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and Canvas API
- **CSS3**: Advanced styling with animations and responsive design
- **JavaScript (ES6+)**: Modern vanilla JavaScript with event handling
- **Bootstrap 5**: Modal components and responsive utilities
- **Bootstrap Icons**: Professional icon set

## 📋 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/bebedudu/bestposition.git
   cd bestposition
   ```

2. **Add your images**
   - Place image files in the `images/` directory
   - Update the `imageFiles` array in `script.js` with your filenames

3. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html
   ```

4. **For development**
   - Use a local server for best experience
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve .`

## 🎮 How to Use

### Basic Interaction
1. **Browse Cards**: View the grid of scratch cards
2. **Click to Open**: Click any card to open it in a modal
3. **Scratch Away**: Click and drag to scratch the overlay
4. **Watch Magic**: Image appears immediately, name fades in progressively
5. **Full Reveal**: At 50% scratched, everything is fully revealed

### Zoom Features
1. **Click Zoom**: Click anywhere on revealed image for 2.5x zoom
2. **Wheel Zoom**: Use mouse wheel for smooth incremental zoom (1x-4x)
3. **Smart Origin**: Zoom centers on your cursor position
4. **Click Again**: Click to zoom out or use wheel to adjust

### Settings & Controls
- **Store Progress**: Toggle to save/restore scratch progress
- **Reset Data**: Clear all saved scratch progress
- **Close Modal**: Click X or outside modal to close

## ⚙️ Configuration

### Adding New Images
```javascript
// In script.js, update the imageFiles array
const imageFiles = [
    "your-image-1.jpg",
    "your-image-2.png",
    // ... add more images
];
```

### Customizing Scratch Settings
```javascript
// Adjust scratch threshold (percentage to fully reveal)
const threshold = 50; // 50% default

// Mobile vs Desktop scratch radius
const scratchRadius = isMobile ? 35 : 20;

// Zoom settings
let minZoom = 1;
let maxZoom = 4;
let zoomStep = 0.2;
```

### Styling Customization
```css
/* Main theme colors */
:root {
    --primary-color: #007bff;
    --background-dark: #212121;
    --modal-background: #2a2a2a;
}

/* Adjust modal size */
.modal-scratch-container {
    width: 400px;
    height: 400px;
}
```

## 🏗️ Project Structure

```
bestposition/
├── index.html              # Main HTML file
├── style.css               # All styles and responsive design
├── script.js               # Core JavaScript functionality
├── images/                 # Image assets directory
│   ├── image1.jpg
│   ├── image2.png
│   └── ...
├── favicon/                # Favicon and app icons
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── ...
└── README.md              # This file
```

## 🎯 Key Features Breakdown

### Scratch Mechanics
- **Canvas-based**: Uses HTML5 Canvas for smooth scratch effects
- **Touch Support**: Works on both mouse and touch devices
- **Progress Tracking**: Real-time calculation of scratched percentage
- **Visual Feedback**: Immediate image reveal for excitement

### Modal System
- **Bootstrap Integration**: Uses Bootstrap 5 modal components
- **Custom Styling**: Heavily customized dark theme
- **Responsive**: Adapts to different screen sizes
- **Smooth Animations**: Professional entrance/exit effects

### Zoom Implementation
- **Dual Method**: Both click and wheel zoom supported
- **Transform Origin**: Dynamic zoom center calculation
- **Smooth Scaling**: CSS transitions for professional feel
- **Cursor Feedback**: Visual indicators for zoom state

### Mobile Optimization
- **Responsive Breakpoints**: Multiple screen size adaptations
- **Touch Gestures**: Optimized for finger interaction
- **Performance**: Efficient rendering on mobile devices
- **UX Considerations**: Larger targets and clear feedback

## 🔧 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Features Used**: Canvas API, CSS Grid, Flexbox, ES6+ JavaScript
- **Fallbacks**: Graceful degradation for older browsers

## 📱 Responsive Design

### Desktop (1200px+)
- Grid layout with hover effects
- 400x400px modal size
- Mouse wheel zoom support

### Tablet (768px - 1199px)
- Adapted grid spacing
- Responsive modal sizing
- Touch and mouse support

### Mobile (< 768px)
- Larger scratch areas
- Full-screen modal option
- Touch-optimized interactions

## 🎨 Customization Guide

### Theme Colors
```css
/* Update these CSS variables for different themes */
--primary-blue: #007bff;
--dark-bg: #212121;
--modal-bg: #2a2a2a;
--text-light: #ffffff;
```

### Animation Timing
```css
/* Adjust animation speeds */
.modal-scratch-container .hidden-image {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Scratch Sensitivity
```javascript
// Adjust how much scratching is needed
const threshold = 50; // Percentage (1-100)
```

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**
   - Check file paths in `imageFiles` array
   - Ensure images exist in `images/` directory
   - Verify image file extensions match

2. **Scratch not working**
   - Check browser console for errors
   - Ensure Canvas API is supported
   - Try refreshing the page

3. **Modal not opening**
   - Verify Bootstrap 5 is loaded
   - Check for JavaScript errors
   - Ensure click events are not blocked

4. **Zoom not working**
   - Check if image is fully revealed
   - Verify mouse wheel events are supported
   - Try click zoom as alternative

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**bebedudu**
- GitHub: [@bebedudu](https://github.com/bebedudu)
- Project: [Best Position Scratch Cards](https://github.com/bebedudu/bestposition)

## 🙏 Acknowledgments

- Bootstrap team for the excellent modal components
- Canvas API for enabling smooth scratch effects
- CSS Grid and Flexbox for responsive layouts
- Modern JavaScript features for clean code

## 📊 Stats

- **Total Images**: 100+ position cards
- **File Size**: Lightweight and optimized
- **Performance**: 60fps smooth animations
- **Compatibility**: 95%+ browser support

---

<p align="center">
  <strong>⭐ Star this repo if you found it helpful! ⭐</strong>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/bebedudu">bebedudu</a>
</p>