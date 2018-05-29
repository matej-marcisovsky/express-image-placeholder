/**
 * NPM modules.
 */
const Color = require('color');

/**
 * Private modules.
 */
const ColorPreset = require('./ColorPreset');

const DARK_RATIO = 0.5;
const MILD_RATIO = 0.2;

class ColorPalette {
	get dark() {
		return this._color.darken(DARK_RATIO).hex();
	}

	get light() {
		return this._color.hex();
	}

	get mild() {
		return this._color.darken(MILD_RATIO).hex();
	}

	constructor(color) {
		color = color.toUpperCase();

		if (Object.keys(ColorPreset).includes(color)) {
			this._color = Color(ColorPreset[color]);
		} else {
			this._color = Color(color);
		}
	}
}

module.exports = ColorPalette;
