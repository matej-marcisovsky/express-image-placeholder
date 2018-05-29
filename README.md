# express-image-placeholder

Express router-level middleware for delivering simple test images.

## Usage

`<your path>/:width(\d+)x:height(\d+)`

Only required attributes are `height` and `width`.

### Optional attributes

- `color` - Should be one of preset colors (blue, green, orange, pink, red) or compatible color string. See [color-string](https://www.npmjs.com/package/color-string). Defaults to blue preset.
- `crossed` - Diagonal lines. Value is `true` or `false`. Defaults to `false`.
- `format` - Default format is PNG. If youd need JPEG use `jpeg` value.
- `label` - Custom label fo your image. If not provided, label is WIDTH&#10799;HEIGHT
