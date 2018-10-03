/**
 * Private modules.
 */
const ColorPalette = require('./ColorPalette');

const ColorPreset = Object.freeze({
	AMBER: new ColorPalette('#FF6F00', '#FFC107'),
	BLUE_GRAY: new ColorPalette('#263238', '#607D8B'),
	BLUE: new ColorPalette('#0D47A1', '#2196F3'),
	BROWN: new ColorPalette('#3E2723', '#795548'),
	CYAN: new ColorPalette('#006064', '#00BCD4'),
	DEEP_ORANGE: new ColorPalette('#BF360C', '#FF5722'),
	DEEP_PURPLE: new ColorPalette('#311B92', '#673AB7'),
	GRAY: new ColorPalette('#212121', '#9E9E9E'),
	GREEN: new ColorPalette('#1B5E20', '#4CAF50'),
	INDIGO: new ColorPalette('#1A237E', '#3F51B5'),
	LIGHT_BLUE: new ColorPalette('#01579B', '#03A9F4'),
	LIGHT_GREEN: new ColorPalette('#33691E', '#8BC34A'),
	LIME: new ColorPalette('#827717', '#CDDC39'),
	ORANGE: new ColorPalette('#E65100', '#FF9800'),
	PINK: new ColorPalette('#880E4F', '#E91E63'),
	PURPLE: new ColorPalette('#4A148C', '#9C27B0'),
	RED: new ColorPalette('#B71C1C', '#F44336'),
	TEAL: new ColorPalette('#004D40', '#009688'),
	YELLOW: new ColorPalette('#F57F17', '#FFEB3B')
});

module.exports = ColorPreset;
