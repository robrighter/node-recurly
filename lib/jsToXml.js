var xml2js = require('xml2js');
var builder = new xml2js.Builder();

function jsToXml(input, rootName) {
	if (rootName) {
		const wrappedInput = {};
		wrappedInput[rootName] = input;
		return builder.buildObject(wrappedInput);
	}
	else {
		const a = input;
		return builder.buildObject(input);
	}
}

module.exports = jsToXml;
