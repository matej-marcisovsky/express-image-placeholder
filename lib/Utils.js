const urlParamToBoolean = param => param === 'true' || param === '1' ? true : false;

const parseUrlParams = params => {
	const { border, color, cross, height, width } = params;

	if (border !== undefined) {
		params.border = urlParamToBoolean(border);
	}

	if (color) {
		params.color = color.toUpperCase()
	}

	if (cross !== undefined) {
		params.cross = urlParamToBoolean(cross);
	}

	if (height) {
		params.height = Number(height);
	}

	if (width) {
		params.width = Number(width);
	}

	return params;
};

module.exports = {
	parseUrlParams,
	urlParamToBoolean
};
