# express-image-placeholder

Express middleware for delivering simple test images. Only dependencies are `canvas` and `http-errors`.

## Usage

Only required attributes are `height` and `width`. The are part of the route.

`<your path>/:width(\d+)x:height(\d+)`

### Optional query attributes

- `border` - Renders border. Value is `true`||`1` or anything else for false. Defaults to `false`.
- `color` - Should be one of preset colors (`amber`, `blue_gray`, `blue`, `brown`, `cyan`, `deep_orange`, `deep_purple`, `gray`, `green`, `indigo`, `light_blue`, `light_green`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow`). Defaults to `gray` preset.
- `cross` - Diagonal lines. Value is `true`||`1` or anything else for false. Defaults to `false`.
- `format` - Supported formats ale JPG, PDF, PNG and SVG. Defaults to PNG.
- `label` - Custom label fo your image. If not provided, label is WIDTH&#10799;HEIGHT.

### Code Example

```javascript
const ImagePlaceholder = require('express-image-placeholder');

app.use('/image/:width(\\d+)x:height(\\d+)', ImagePlaceholder);
```

## Samples

![Sample gray image without border and cross.](600x200g.png?raw=true)

![Sample blue image with border and cross.](600x200cbb.png?raw=true)


