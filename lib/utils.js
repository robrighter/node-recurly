exports.addParams = function(route, keys){
    var newRoute = route.slice();
    var path = newRoute[0];
    newRoute[0] = path.replace(/(:[^\/]+)/g, function(){
        var key = arguments[0].substr(1);
        return keys[key];
    });
    return newRoute;
};

var addQueryParams = exports.addQueryParams = function(route, params){
    var newRoute = route.slice();
    var _params = [];
    if(params){
        for(var prop in params){
            _params.push(prop+'='+ encodeURIComponent(params[prop]));
        }
    }
    if(_params.length > 0) return [newRoute[0] + '?' + _params.join('&'), newRoute[1]];
    else return newRoute;
};

var parseUrlLink = exports.parseUrlLink = function(result, callback) {
  var links = {};
  // Parse out our link
  if(result.headers.link) {
    // link format:
    // '<https://datahero.recurly.com/v2/accounts?cursor=1411036382190143765>; rel="next", <https://datahero.recurly.com/v2/accounts?cursor=1411036382190143765>; rel="last"'
    result.headers.link.replace(/<([^>]*)>;\s*rel="([\w]*)\"/g, function(m, uri, type) {
      links[type] = uri;
    });
    return links;
  } else {
    return null;
  }
};

exports.iterateRequest = function(client, route, queryString, endpointName, singleItemName, callback) {
  var url = require('url');

  // Set up our results that we'll return
  var results = {
    data: {}
  };
  results.data[endpointName] = {};
  results.data[endpointName][singleItemName] = [];

  var doListAll = function(cursor, callback) {
    client.request(cursor, function(error, result) {
      if(error) {
        return callback(error);
      } else {
        // Test to see if we have more pages
        if (result.headers.link) {
          var links = parseUrlLink(result);
          // Store off our current results
          results.data[endpointName][singleItemName] = results.data[endpointName][singleItemName].concat(result.data[endpointName][singleItemName]);
          if(links.next) {
            // Let's just get our querystring params
            queryString = url.parse(links.next, true).query;
            // Recurse
            doListAll(addQueryParams(route, queryString), callback);
          } else {
            // We are done so return
            return callback(null, results);
          }
        } else { // We didn't have a next link - just return the results
          return callback(null, result);
        }
      }
    }, null);
  };

  //Kick off the listing
  doListAll(addQueryParams(route, queryString), callback);
};