var https  = require('https');
var xml2js = require('xml2js/lib');
var events = require('events');
  
module.exports = function(config){
    
  this.accounts = {
    create: function(details, callback){
      return new RecurlyRequest('/accounts', 'POST', js2xml(details,'account'));
    },
    update: function(accountcode, details){
      return new RecurlyRequest('/accounts/'+accountcode, 'PUT', js2xml(details,'account'));
    },
    get: function(accountcode, callback){
      return new RecurlyRequest('/accounts/'+accountcode, 'GET');
    },
    close: function(accountcode, callback){
      return new RecurlyRequest('/accounts/'+accountcode, 'DELETE');
    },
    listAll: function(callback, filter){
      return new RecurlyRequest('/accounts' + ((filter)? '?show='+filter : '' ), 'GET');
    }
  }
    
  this.billingInfo = {
    update: function(accountcode, details, callback){
      return new RecurlyRequest('/accounts/'+accountcode+'/billing_info', 'PUT', js2xml(details,'billing_info'));
    },
    get: function(accountcode, callback){
      return new RecurlyRequest('/accounts/'+accountcode+'/billing_info', 'GET');
    },
    delete: function(accountcode, callback){
      return new RecurlyRequest('/accounts/'+accountcode+'/billing_info', 'DELETE');
    }
  }
    
  //http://docs.recurly.com/api/charges
  this.charges = {
    listAll: function(accountcode, callback, filter){
      return new RecurlyRequest('/accounts/' + accountcode +'/charges'+ ((filter)? '?show='+filter : '' ), 'GET');
    },
    chargeAccount: function(accountcode, details, callback){
      return new RecurlyRequest('/accounts/' + accountcode + '/charges', 'POST', js2xml(details,'charge'));
    }
  }
    
  //http://docs.recurly.com/api/coupons
  this.coupons = {
    getAssociatedWithAccount: function(accountcode, callback){
      return new RecurlyRequest('/accounts/' + accountcode +'/coupon' , 'GET');
    },
    //NOTE: Redeem coupon with subscription not added here since it is a duplication of the subscription creation method
    redeemOnAccount: function(accountcode, details, callback){
      return new RecurlyRequest('/accounts/' + accountcode + '/coupon', 'POST', js2xml(details,'coupon'));
    },
    removeFromAccount: function(accountcode, callback){
      return new RecurlyRequest('/accounts/'+accountcode+'/coupon', 'DELETE');
    }
      
  }
    
  //http://docs.recurly.com/api/credits
  this.credits = {
    listAll: function(accountcode, callback){
      return new RecurlyRequest('/accounts/' + accountcode +'/credits', 'GET');
    },
    creditAccount: function(accountcode, details, callback){
      return new RecurlyRequest('/accounts/' + accountcode + '/credits', 'POST', js2xml(details,'credit'));
    }
  }
    
  //http://docs.recurly.com/api/invoices
  this.invoices = {
    getAssociatedWithAccount: function(accountcode, callback){
      return new RecurlyRequest('/accounts/' + accountcode +'/invoices', 'GET');
    },
    get: function(invoiceid, callback){
      return new RecurlyRequest('/invoices/' + invoiceid, 'GET');
    },
    invoiceAccount: function(accountcode, callback){
      return new RecurlyRequest('/accounts/' + accountcode + '/invoices', 'POST');
    }
  }
    
  //http://docs.recurly.com/api/subscriptions
  this.subscriptions = {
    getAssociatedWithAccount: function(accountcode, callback){
      return new RecurlyRequest('/accounts/' + accountcode +'/subscription', 'GET');
    }
    //TODO: Finish These
      
  }
    
  //http://docs.recurly.com/api/subscription-plans
  this.subscriptionPlans = {
    listAll: function(callback){
      return new RecurlyRequest('/company/plans', 'GET');
    },
    get: function(plancode, callback){
      return new RecurlyRequest('/company/plans/' + plancode, 'GET');
    }
    //Create, Update, and Delete are not implemented because the reculy documentation indicates them as advanced cases
  }
    
  //http://docs.recurly.com/api/transactions
  this.transactions = {
    //TODO: Finish These
  }
    
  function debug(s){
    if(config.DEBUG){
      console.log(s);
    }
  }
}
// end exports ///////////////////////////////////////////////////////////////////////////////

// Request Object...

function RecurlyRequest (endpoint, method, data) {

  var self = this;

  var data = data ? '<?xml version="1.0"?>\n' + data : null;

  var options = {
    host: 'api-' + config.ENVIRONMENT + '.recurly.com',
    port: 443,
    path: endpoint,
    method: method,
    headers: {
      Authorization: "Basic "+(new Buffer(config.API_USERNAME+":"+config.API_PASSWORD)).toString('base64'),
      Accept: 'application/xml',
      'Content-Length' : (data) ? data.length : 0
    }
  };
      
  if(method.toLowerCase() == 'post' || method.toLowerCase() == 'put' ){
    options.headers['Content-Type'] = 'application/xml';
    debug(data); 
  }

  debug(options);

  var req = https.request(options, function(res) {
    var responsedata = '';
    res.on('data', function(d) {
      responsedata+=d;
    });
    res.on('end', function(){
      responsedata = trim(responsedata);
      debug('Response is: ' + res.statusCode);
      debug(responsedata);
      try{
        if((res.statusCode == 404) || (res.statusCode == 422) || (res.statusCode == 500) || (res.statusCode == 412)){
          parseXML(responsedata, function(result){
            self.emit("error", result);
          });
        } else if(res.statusCode >= 400){
          parseXML(responsedata, function(result){
            self.emit("error", result);
          });
        } else {
          if(responsedata != ''){
            parseXML(responsedata, function(result){
              self.emit("error", result);
            });
          } else {
            self.emit("success", res.statusCode);
          }
        }
      } catch(e){
        self.emit("error", e)
      }
    });
  });

  if(data){
    req.write(data);
  }

  req.end();

  req.on('error', function(e) {
    self.emit("error", e);
  });

}
RecurlyRequest.prototype = events.EventEmitter.prototype;

// Utils... 
  
function js2xml(js, wraptag){
  if(js instanceof Object){
    return js2xml(Object.keys(js).map(function(key){return js2xml(js[key], key);}).join('\n'), wraptag);
  }else{return ((wraptag)?'<'+ wraptag+'>' : '' ) + js + ((wraptag)?'</'+ wraptag+'>' : '' );}
}
  
function parseXML(xml, callback){
  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    callback(result);
  });
  parser.parseString(xml);
}
  
function trim(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}
