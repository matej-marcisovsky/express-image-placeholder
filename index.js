/**
 * NPM modules.
 */
const { createCanvas } = require('canvas');
const Express = require('express');

/**
 * Private modules.
 */
const ColorPreset = require('./lib/ColorPreset');
const ImageFormat = require('./lib/ImageFormat');
const Utils = require('./lib/Utils');

const CROSS_CHARACTER = '\u{02A2F}';
const FONT_SIZE = 18;
const LINE_WIDTH = 2;
const DOUBLE_LINE_WIDTH = LINE_WIDTH * 2;

const router = Express.Router();

router.get('/:width(\\d+)x:height(\\d+)', (req, res, next) => {
	const { height, width } = Utils.parseUrlParams(req.params);
	if (!Number.isInteger(height) || !Number.isInteger(width)) {
		throw new Error(`Width and height must be integers.`);
	}

	const {
		border = false,
		color = 'GRAY',
		cross = false,
		format = 'png',
		label = `${width}${CROSS_CHARACTER}${height}`
	} = Utils.parseUrlParams(req.query);

	let canvas = null;
	if (format === ImageFormat.SVG || format === ImageFormat.PDF) {
		canvas = createCanvas(width, height, format);
	} else {
		canvas = createCanvas(width, height);
	}

	{
		const colorPalette = ColorPreset[color.toUpperCase()];
		if (!colorPalette) {
			throw new Error(`Color palette '${color}' not found.`);
		}

		const ctx = canvas.getContext('2d');

		if (border) {
			ctx.fillStyle = colorPalette.dark;
			ctx.fillRect(0, 0, width, height);

			ctx.fillStyle = colorPalette.light;
			ctx.fillRect(LINE_WIDTH, LINE_WIDTH, width - DOUBLE_LINE_WIDTH, height - DOUBLE_LINE_WIDTH);
		} else {
			ctx.fillStyle = colorPalette.light;
			ctx.fillRect(0, 0, width, height);
		}

		if (cross) {
			ctx.strokeStyle = colorPalette.dark;
			ctx.lineWidth = 1;

			ctx.beginPath();
			ctx.moveTo(-LINE_WIDTH, 0);
			ctx.lineTo(width + LINE_WIDTH, height);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(width + LINE_WIDTH, 0);
			ctx.lineTo(-LINE_WIDTH, height);
			ctx.closePath();
			ctx.stroke();
		}

		if (label) {
			ctx.fillStyle = colorPalette.light;
			ctx.fillRect(
				LINE_WIDTH,
				(height - FONT_SIZE) / 2 - LINE_WIDTH,
				width - DOUBLE_LINE_WIDTH,
				FONT_SIZE + DOUBLE_LINE_WIDTH
			);

			ctx.fillStyle = colorPalette.dark;
			ctx.font = `bold ${FONT_SIZE}px Arial, Helvetica, sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(label, width / 2, height / 2);
		}
	}

	switch(format) {
		case ImageFormat.JPEG:
		case ImageFormat.JPG:
			res.set('Content-Type', 'image/jpeg');

			return canvas.createJPEGStream({
				quality: 75,
				progressive: true
			}).pipe(res);
		case ImageFormat.PDF:
			res.set('Content-Type', 'application/pdf');

			return res.send(canvas.toBuffer());
		case ImageFormat.PNG:
			res.set('Content-Type', 'image/png');

			return canvas.createPNGStream({
				compressionLevel: 9
			}).pipe(res);
		case ImageFormat.SVG:
			res.set('Content-Type', 'image/svg+xml');

			return res.send(canvas.toBuffer());
		default:
			throw new Error(`Unknown image format provided.`);
	}
});

module.exports = router;
