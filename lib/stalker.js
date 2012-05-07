var fs   = require('fs');
var path = require('path'); 

function Stalker(filename, callback){
  if(false === (this instanceof Stalker)) {
    return new Stalker(filename, callback);
  }
  var filename = filename;

  this.stalk(filename, callback);

}

Stalker.encapsulate_closure = function(filename, callback){
  return function(){
  	new Stalker(filename, callback);
  }
};

Stalker.prototype.stalk = function(filename, callback) {
  var self = this;

  fs.open(filename, "r", function(err, fd){

    var fd = fd; 
    var length = 1000;
    var buffer = new Buffer(length + 1);
    var offset = 0;
    var position = null;

    fs.watch(filename, function(event, fileName){

      if (event === 'rename'){
      	// shit we have to reopen file probably 
      	// logrotate or something wants to fuck us up
      	  var retry_foo = Stalker.encapsulate_closure(filename, callback);
      	  path.exists(filename, function(exists){
      	  	if( exists === false){
              fs.unwatchFile(filename);
              fs.close(fd, function(){ });      	  	
      	  	}
      	  });
      	  setTimeout( function(){
      	  	console.log("Retrying!");
             retry_foo();
      	  }, 1000);
      }
      fs.read(fd, buffer, offset, length, position, function(err, bytesRead, buffer){
      	if(bytesRead > 0){
          callback( buffer.toString('utf8', 0, bytesRead) );     	
        }
      });
      
    });  
  });

};

module.exports = Stalker;



