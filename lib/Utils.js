const QueryParamToBoolean = value => {
	if (value === '1' || value === 'true') {
		return true;
	}

	return false;
};

module.exports = {
	QueryParamToBoolean
};
