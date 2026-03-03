# Icons Directory

This directory contains all icon assets used throughout the application.

## Icon Sets

### Favicon Files
- `favicon.ico` - 16x16, 32x32 (multi-size ICO)
- `favicon-16x16.png` - 16x16 PNG
- `favicon-32x32.png` - 32x32 PNG
- `apple-touch-icon.png` - 180x180 PNG for iOS
- `android-chrome-192x192.png` - 192x192 PNG
- `android-chrome-512x512.png` - 512x512 PNG

### UI Icons (SVG format)
- `menu.svg` - Navigation menu
- `close.svg` - Close/exit
- `search.svg` - Search
- `user.svg` - User/profile
- `cart.svg` - Shopping cart
- `heart.svg` - Wishlist/favorites
- `filter.svg` - Filter options
- `sort.svg` - Sort options
- `edit.svg` - Edit action
- `delete.svg` - Delete action
- `add.svg` - Add new
- `remove.svg` - Remove item
- `check.svg` - Check/confirm
- `warning.svg` - Warning alert
- `info.svg` - Information
- `help.svg` - Help/support
- `settings.svg` - Settings
- `download.svg` - Download
- `upload.svg` - Upload
- `print.svg` - Print
- `share.svg` - Share

### Feature Icons (SVG format)
- `delivery-truck.svg` - Shipping/delivery
- `quality-badge.svg` - Quality guarantee
- `warranty.svg` - Warranty information
- `support.svg` - Customer support
- `secure-payment.svg` - Secure checkout
- `free-shipping.svg` - Free shipping
- `easy-returns.svg` - Returns policy
- `assembly.svg` - Assembly required
- `eco-friendly.svg` - Eco-friendly materials

### Social Media Icons (SVG format)
- `facebook.svg` - Facebook
- `instagram.svg` - Instagram
- `twitter.svg` - Twitter/X
- `pinterest.svg` - Pinterest
- `youtube.svg` - YouTube
- `linkedin.svg` - LinkedIn

### Payment Icons (SVG format)
- `visa.svg` - Visa
- `mastercard.svg` - Mastercard
- `amex.svg` - American Express
- `discover.svg` - Discover
- `paypal.svg` - PayPal
- `apple-pay.svg` - Apple Pay
- `google-pay.svg` - Google Pay
- `amex.svg` - American Express

## Icon Specifications

### SVG Icons
- **Format**: SVG (optimized)
- **ViewBox**: Usually 24x24 or 20x20
- **Colors**: CurrentColor for theming
- **Stroke width**: 1.5-2px typically

### PNG Icons
- **Resolution**: Multiple sizes as needed
- **Format**: PNG with transparency
- **Color space**: sRGB

## Usage Examples

```html
<!-- SVG Icon with theming -->
<svg class="icon" width="24" height="24">
    <use href="/assets/icons/menu.svg#icon"></use>
</svg>

<!-- PNG Icon -->
<img src="/assets/icons/favicon-32x32.png" alt="icon">

<!-- Font Awesome fallback (when SVGs not available) -->
<i class="fas fa-truck"></i>

