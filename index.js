var request = require('request');
var q = require('q');
var conf = require(__dirname+'/config.js');
var TIMEOUT = 500;
var lastTransactionHash = conf.get('LAST_PAYMENT_HASH');

var makeUrl = function(hash){
  return 'http://localhost:5990/v1/accounts/rMinhWxZz4jeHoJGyddtmwg6dWhyqQKtJz/notifications/'+hash+'?types=payment';
};

function handleError(err){
  console.log(err);

  //if error is critical
  //Listener.stop();
}

function handleNotification(notification){
  console.log(notification);
  if(notification.next_hash != ""){
    return notification.next_hash;
  }
};

function saveHash(hash){
  if(hash){
    console.log('saving hash ', hash);
    conf.set('LAST_PAYMENT_HASH', hash);
    conf.save();
  } else {
    console.log('no notification');
  }
}

function getNextNot (hash) {
  var deferred = q.defer();
  var url = makeUrl(hash);

  request(url, function(error, response, body){
    if(error){
      deferred.reject(new Error('ERROR:request: ', error));
    } else {
      deferred.resolve(body);
    }
  });

  setTimeout(function(){
    Listner.listen();
  }, TIMEOUT);
  return deferred.promise;
}


var Listener = {
  listen: function(){
    getNextNot(lastTransactionHash)
      .then(handleNotification)
      .then(saveHash)
      .catch(handleError)
      .done();
  },
  stop: function(){
    console.log('halting process');
  }
};

Listener.listen();




