exports = module.exports = function(io) {  
  const Message = require('../database/objectClasses/Message');
  const config = require('../config.json').devDbUri;
  const ModelHandler = require('../database/models/ourModels');
  let ModelHandlerObj = new ModelHandler().initWithParameters(
    config.username,
    config.password,
    config.host,
    config.port,
    config.database);

  Message.setDBConnection(ModelHandlerObj.getConnection());


  io.on('connection', (socket) => {
    socket.emit('news', {hi: 'hi'});
    socket.on('newMessage',(data) => {
      console.log(data);
      Message.getConversation('a@user.com', 'b@user.com', (err, conversation) => {
        console.log('conversation results = '+conversation);
        socket.emit('refreshMessages', conversation);
      })
    });
    /*
    // On conversation entry, join broadcast channel
    socket.on('enter conversation', (conversation) => {
      socket.join(conversation);
      // console.log('joined ' + conversation);
    });

    socket.on('leave conversation', (conversation) => {
      socket.leave(conversation);
      // console.log('left ' + conversation);
    })

    socket.on('new message', (conversation) => {
      io.sockets.in(conversation).emit('refresh messages', conversation);
      });

    socket.on('disconnect', () => {
      //console.log('user disconnected');
    });*/
  });
}