/**
 * NPM modules.
 */
const { createCanvas } = require('canvas');
const Express = require('express');

/**
 * Private modules.
 */
const ColorPalette = require('./lib/ColorPalette');
const ImageFormat = require('./lib/ImageFormat');
const Utils = require('./lib/Utils');

const CROSS = '\u{02A2F}';
const DEFAULT_COLOR = 'blue';
const LINE_WIDTH = 2;

const router = Express.Router();

router.get('/:width(\\d+)x:height(\\d+)', (req, res, next) => {
	let { height, width } = req.params;
	height = Number(height);
	width = Number(width);
	if (!Number.isInteger(height) || !Number.isInteger(width)) {
		throw new Error(`Width and height must be integers.`);
	}

	req.query.crossed = Utils.QueryParamToBoolean(req.query.crossed);

	const { format = ImageFormat.PNG } = req.query;
	let canvas = null;
	if (format === ImageFormat.SVG || format === ImageFormat.PDF) {
		canvas = createCanvas(width, height, format);
	} else {
		canvas = createCanvas(width, height);
	}

	{
		const {
			color = DEFAULT_COLOR,
			crossed = false,
			label = `${width}${CROSS}${height}`
		} = req.query;
		const colorPalette = new ColorPalette(color);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = colorPalette.dark;
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = colorPalette.light;
		ctx.fillRect(LINE_WIDTH, LINE_WIDTH, width - 2 * LINE_WIDTH, height - 2 * LINE_WIDTH);

		if (crossed) {
			ctx.strokeStyle = colorPalette.mild;
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(0 - LINE_WIDTH, 0);
			ctx.lineTo(width + LINE_WIDTH, height);
			ctx.closePath();
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(width + LINE_WIDTH, 0);
			ctx.lineTo(0 - LINE_WIDTH, height);
			ctx.closePath();
			ctx.stroke();
		}

		ctx.fillStyle = colorPalette.dark;
		ctx.font = 'bold 18px Arial, Helvetica, sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(label, width / 2, height / 2);
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
