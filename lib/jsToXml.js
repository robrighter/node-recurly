const xml2js = require('xml2js');
const builder = new xml2js.Builder();

const jsToXml = input => builder.buildObject(input);

module.exports = jsToXml;