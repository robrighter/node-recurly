var async = require('async'),
    url = require('url');

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

/**
 * makeEachSeriesIterator
 *
 * Creates a function that will get all records for `route` and call `iterator` on each record.
 *
 * @param {Client} client Initialized recurly client.
 * @param {String} route URL of resource
 * @param {String} endpointName Plural name of resouce.
 * @param {String} singleItemName Signular name of resource.
 * @return {function(options, iterator, callback)}
 */
exports.makeEachSeriesIterator = function(client, route, endpointName, singleItemName) {
  /**
   *
   * @param {Object} options like:
   *   per_page: {Number} Default 200. Max number of items to get per page. (Currently recurly api limits you to 200).
   *   limit: {Number} Default everything. Total number of items to get before calling the final callback.
   * @param {function(item, callback)} iterator Function to call for each item returned from recurly. Call callback when
   *   you finish processing the item. Feeds items to iterator sequentially.
   * @param {function(error)} callback Called when all items (up to limit) have been fetched and fed through `iterator`.
   */
 return function(options, iterator, callback) {

    options = options || {};

    var perPage = options.per_page || 200,
        limit = options.limit,
        initialCursor = addQueryParams(route, {per_page: perPage}),
        count = 0;

    nextPage(initialCursor);

    function nextPage(cursor) {
      client.request(cursor, function(error, result) {
        if (error) {
          return callback(error);
        }

        var records = result.data[endpointName][singleItemName];
        if (!records) {
          return callback(new Error('Response has no data'));
        }

        var links,
            nextQueryString,
            nextCursor,
            isLimitHit;

        // Parse out the next cursor
        if (result.headers.link) {
          links = parseUrlLink(result);
          if (links.next) {
            nextQueryString = url.parse(links.next, true).query;
            nextCursor = addQueryParams(route, nextQueryString);
          }
        }

        isLimitHit = limit && (count + records.length) > limit;
        if (isLimitHit) {
          // We will be over the limit, so slice down
          records = records.slice(0, limit - count);
        }

        // Iterate through results
        count += records.length;
        async.eachSeries(records, iterator, function(error) {
          if (error) {
            return callback(error);
          }

          if (isLimitHit || !nextCursor) {
            // Finished
            callback();
          } else {
            nextPage(nextCursor);
          }
        });
      });
    }
  };
};
