# Assets Folder

## 📁 Purpose

This folder is designated for storing local image assets for the product webpage.

## 🖼️ Current Setup

The project currently uses CDN images from Unsplash for demonstration purposes. This allows the project to work immediately without requiring local image files.

## 📥 Adding Your Own Images

### Recommended Images to Add

1. **Product Images** (for carousel)
   - `product-1.jpg` - Main product view
   - `product-2.jpg` - Side view
   - `product-3.jpg` - Detail view
   - `product-4.jpg` - Lifestyle shot
   - Recommended size: 800x800px (square)
   - Format: JPG or WebP

2. **Brand Logos** (optional)
   - `brand-1.svg` or `brand-1.png`
   - `brand-2.svg` or `brand-2.png`
   - etc.
   - Recommended size: 120x40px
   - Format: SVG (preferred) or PNG

3. **Icons** (optional)
   - Currently using inline SVG
   - Can be replaced with image files if needed

### How to Use Local Images

1. **Add images to this folder**
   ```
   assets/
   ├── product-1.jpg
   ├── product-2.jpg
   ├── product-3.jpg
   ├── product-4.jpg
   └── brand-logos/
       ├── brand-1.svg
       └── brand-2.svg
   ```

2. **Update image paths in index.html**
   
   Replace:
   ```html
   <img src="https://images.unsplash.com/photo-..." alt="Product view 1">
   ```
   
   With:
   ```html
   <img src="assets/product-1.jpg" alt="Product view 1">
   ```

3. **Optimize images before adding**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Convert to WebP for better compression
   - Use appropriate dimensions (don't use 4000px images for 800px display)

## 🎨 Image Specifications

### Product Images
- **Aspect Ratio**: 1:1 (square) recommended
- **Dimensions**: 800x800px to 1200x1200px
- **Format**: JPG (photos) or PNG (graphics)
- **Quality**: 80-90% for JPG
- **File Size**: < 200KB per image (optimized)

### Brand Logos
- **Aspect Ratio**: Varies (typically 3:1 or 4:1)
- **Dimensions**: 120x40px to 240x80px
- **Format**: SVG (preferred) or PNG
- **Background**: Transparent
- **File Size**: < 50KB per logo

### Icons
- **Format**: SVG (scalable)
- **Size**: 24x24px to 48x48px
- **Style**: Consistent stroke width
- **Color**: Single color (can be changed via CSS)

## 🔧 Image Optimization Tips

### Online Tools
- **TinyPNG**: https://tinypng.com/ (PNG/JPG compression)
- **Squoosh**: https://squoosh.app/ (WebP conversion)
- **SVGOMG**: https://jakearchibald.github.io/svgomg/ (SVG optimization)

### Command Line Tools
```bash
# ImageMagick - Resize and optimize
magick convert input.jpg -resize 800x800 -quality 85 output.jpg

# cwebp - Convert to WebP
cwebp -q 80 input.jpg -o output.webp
```

### Photoshop Export Settings
- File > Export > Export As
- Format: JPG or PNG
- Quality: 80-90%
- Resize to appropriate dimensions
- Check "Convert to sRGB"

## 📦 Recommended Folder Structure

```
assets/
├── images/
│   ├── products/
│   │   ├── product-1.jpg
│   │   ├── product-2.jpg
│   │   ├── product-3.jpg
│   │   └── product-4.jpg
│   ├── brands/
│   │   ├── brand-1.svg
│   │   ├── brand-2.svg
│   │   └── ...
│   └── icons/
│       └── (optional custom icons)
└── README.md (this file)
```

## 🌐 Using CDN Images (Current Setup)

### Advantages
- No local storage needed
- Fast global delivery
- Automatic optimization
- No upload required

### Disadvantages
- Requires internet connection
- External dependency
- Less control over images
- May change or become unavailable

### Current CDN Sources
- Unsplash (https://unsplash.com/)
- Free to use
- High-quality images
- Automatic resizing via URL parameters

## 🔄 Switching from CDN to Local

### Step-by-Step Process

1. **Download or create your images**
2. **Optimize images** (see tools above)
3. **Add to assets folder**
4. **Update HTML** (change src attributes)
5. **Test locally** (ensure images load)
6. **Verify file sizes** (keep under 200KB each)

### Example Update

Before (CDN):
```html
<img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop" 
     alt="Product view 1">
```

After (Local):
```html
<img src="assets/images/products/product-1.jpg" 
     alt="Product view 1">
```

## 📱 Responsive Images

For better performance, consider using responsive images:

```html
<img 
  srcset="assets/product-1-400.jpg 400w,
          assets/product-1-800.jpg 800w,
          assets/product-1-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw,
         (max-width: 1024px) 50vw,
         800px"
  src="assets/product-1-800.jpg"
  alt="Product view 1">
```

## 🎯 Best Practices

1. **Use descriptive filenames**
   - ✅ `wireless-headphones-front.jpg`
   - ❌ `IMG_1234.jpg`

2. **Keep file sizes small**
   - Optimize before adding
   - Target < 200KB per image
   - Use WebP when possible

3. **Use appropriate formats**
   - Photos: JPG or WebP
   - Graphics/logos: PNG or SVG
   - Icons: SVG

4. **Maintain aspect ratios**
   - Don't distort images
   - Crop appropriately
   - Use CSS object-fit if needed

5. **Add alt text**
   - Describe the image
   - Be specific and concise
   - Important for accessibility

## 🚀 Performance Tips

1. **Lazy loading** (already implemented)
   ```html
   <img src="..." alt="..." loading="lazy">
   ```

2. **WebP with fallback**
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>
   ```

3. **Preload critical images**
   ```html
   <link rel="preload" as="image" href="assets/hero-image.jpg">
   ```

## 📊 Image Checklist

Before adding images, ensure:
- [ ] Images are optimized (< 200KB)
- [ ] Correct dimensions (800x800px for products)
- [ ] Appropriate format (JPG/PNG/SVG/WebP)
- [ ] Descriptive filenames
- [ ] Alt text prepared
- [ ] Tested on different devices
- [ ] Backup of original files

## 🔗 Useful Resources

- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Can I Use WebP](https://caniuse.com/webp)
- [Unsplash Free Images](https://unsplash.com/)
- [Pexels Free Images](https://www.pexels.com/)

---

**Note**: The current project works perfectly with CDN images. Adding local images is optional and recommended only when you have specific product images to showcase.
