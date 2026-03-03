markdown
# Videos Directory

This directory contains video assets for promotional and instructional content.

## Video Categories

### Product Videos
- `harmony-sofa-product.mp4` - Product showcase
- `coffee-table-assembly.mp4` - Assembly guide
- `furniture-care-guide.mp4` - Maintenance tips

### Promotional Videos
- `brand-story.mp4` - Company introduction
- `spring-collection.mp4` - Seasonal collection
- `sale-promo.mp4` - Sales promotion

### Tutorials
- `how-to-measure-space.mp4` - Measurement guide
- `furniture-assembly-tips.mp4` - Assembly help
- `cleaning-care-instructions.mp4` - Care instructions

### Background Videos
- `hero-background.mp4` - Website hero background
- `showroom-tour.mp4` - Virtual showroom tour
- `manufacturing-process.mp4` - Behind the scenes

## Video Specifications

### Product Videos
- **Duration**: 30-60 seconds
- **Resolution**: 1920x1080 (1080p)
- **Format**: MP4 H.264
- **Frame Rate**: 30fps
- **Bitrate**: 5-8 Mbps
- **File Size**: Under 50MB

### Promotional Videos
- **Duration**: 60-90 seconds
- **Resolution**: 1920x1080 (1080p)
- **Format**: MP4 H.264
- **Frame Rate**: 30fps
- **Bitrate**: 8-10 Mbps
- **File Size**: Under 100MB

### Background Videos
- **Duration**: 15-30 seconds (looped)
- **Resolution**: 1920x1080 (1080p)
- **Format**: MP4 H.264
- **Frame Rate**: 30fps
- **Bitrate**: 3-5 Mbps
- **File Size**: Under 20MB

### Mobile Optimized
- **Resolution**: 640x360 (360p)
- **Format**: MP4 H.264
- **Bitrate**: 1-2 Mbps

## Naming Convention

`[category]-[description]-[quality].[extension]`

Examples:
- `product-harmony-sofa-1080p.mp4`
- `promo-spring-sale-1080p.mp4`
- `tutorial-assembly-480p.mp4`
- `bg-hero-loop-720p.mp4`

## Thumbnail Images

Each video should have a corresponding thumbnail:
`[video-name]-thumbnail.jpg` - 1280x720px, JPG, 80% quality

## Accessibility

All videos should include:
- Closed captions (.vtt files)
- Transcripts (.txt or .pdf)
- Audio descriptions (if needed)

## Video Embed Example

```html
<video width="100%" controls poster="/assets/videos/thumbnails/harmony-sofa-thumbnail.jpg">
    <source src="/assets/videos/product-harmony-sofa-1080p.mp4" type="video/mp4">
    <source src="/assets/videos/product-harmony-sofa-720p.mp4" type="video/mp4" media="(max-width: 768px)">
    <track src="/assets/videos/captions/harmony-sofa-en.vtt" kind="captions" srclang="en" label="English">
    Your browser does not support the video tag.
</video>
```

## Hosting Strategy
For performance, consider hosting videos on:

- `CDN (Cloudinary, Fastly)`
- `YouTube (embed for public videos)`
- `Vimeo (for higher quality/private videos)`