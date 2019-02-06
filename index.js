/**
 * NPM modules.
 */
const { createCanvas } = require('canvas');
const Color = require('color');
const HttpError = require('http-errors');

/**
 * Private modules.
 */
const ImageFormat = require('./lib/ImageFormat');
const Utils = require('./lib/Utils');

const LINE_WIDTH = 1;
const CROSS_CHARACTER = '\u{02A2F}';
const DARK_RATIO = 0.5;
const DOUBLE_LINE_WIDTH = LINE_WIDTH * 2;
const FONT_SIZE = 18;
const LABEL_BACKGROUND_OFFSET = 8;

module.exports = (req, res, next) => {
	const { height, width } = Utils.parseUrlParams(req.params);
	if (!Number.isInteger(height) || !Number.isInteger(width)) {
		return next(new HttpError.BadRequest());
	}

	const {
		border = false,
		color = '#9E9E9E',
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
		let primaryColor = null, secondaryColor = null;
		try {
			primaryColor = Color(color).hex();
			secondaryColor = Color(color).darken(DARK_RATIO).hex();
		} catch (error) {
			return next(error);
		}

		const ctx = canvas.getContext('2d');

		if (border) {
			ctx.fillStyle = secondaryColor;
			ctx.fillRect(0, 0, width, height);

			ctx.fillStyle = primaryColor;
			ctx.fillRect(LINE_WIDTH, LINE_WIDTH, width - DOUBLE_LINE_WIDTH, height - DOUBLE_LINE_WIDTH);
		} else {
			ctx.fillStyle = primaryColor;
			ctx.fillRect(0, 0, width, height);
		}

		if (cross) {
			ctx.strokeStyle = secondaryColor;
			ctx.lineWidth = LINE_WIDTH;

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width, height);
			ctx.closePath();
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(width, 0);
			ctx.lineTo(0, height);
			ctx.closePath();
			ctx.stroke();
		}

		if (label) {
			ctx.fillStyle = primaryColor;
			ctx.fillRect(
				0 + LINE_WIDTH,
				(height - FONT_SIZE) / 2 - LABEL_BACKGROUND_OFFSET,
				width - DOUBLE_LINE_WIDTH,
				FONT_SIZE + 2 * LABEL_BACKGROUND_OFFSET
			);

			ctx.fillStyle = secondaryColor;
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
			return next(new HttpError.BadRequest());
	}
};
