'use babel';

var connect = require('connect');
var serveStatic = require('serve-static');

startServer = function(path, port) {
  console.log(path);

  return connect().use(serveStatic(path)).listen(port, function(){
      console.log('Server running on port ' + port);
  });
};

export default startServer;
