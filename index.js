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

const CROSS = '\u{02A2F}';
const LINE_WIDTH = 2;

const router = Express.Router();

router.get('/:width(\\d+)x:height(\\d+)', (req, res, next) => {
	let { height, width } = req.params;
	height = Number(height);
	width = Number(width);
	if (!Number.isInteger(height) || !Number.isInteger(width)) {
		throw new Error(`Width and height must be integers.`);
	}

	const canvas = createCanvas(width, height);
	{
		const {
			color = 'blue',
			crossed = 'false',
			label = `${width}${CROSS}${height}`
		} = req.query;
		const colorPalette = new ColorPalette(color);
		const ctx = canvas.getContext('2d');

		ctx.fillStyle = colorPalette.dark;
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = colorPalette.light;
		ctx.fillRect(LINE_WIDTH, LINE_WIDTH, width - 2 * LINE_WIDTH, height - 2 * LINE_WIDTH);

		if (crossed === 'true') {
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

	const { format = 'png' } = req.query;
	switch(format) {
		case ImageFormat.JPEG:
			res.set('Content-Type', 'image/jpeg');

			return canvas.jpegStream({
				quality: 75,
				progressive: true
			}).pipe(res);
		case ImageFormat.PNG:
			res.set('Content-Type', 'image/png');

			return canvas.pngStream().pipe(res);
		default:
			throw new Error(`Unknown image format provided.`);
	}
});

module.exports = router;
