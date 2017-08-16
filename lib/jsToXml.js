var xml2js = require('xml2js');
var builder = new xml2js.Builder();

function jsToXml(input) {
	return builder.buildObject(input);
}

module.exports = jsToXml;