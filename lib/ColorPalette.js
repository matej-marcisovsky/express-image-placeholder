class ColorPalette {
	get dark() {
		return this._darkColor;
	}

	get light() {
		return this._lightColor;
	}

	constructor(darkColor, lightColor) {
		this._darkColor = darkColor;
		this._lightColor = lightColor;
	}
}

module.exports = ColorPalette;
