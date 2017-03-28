exports = module.exports = function(io, db) {  
  const Message = require('../database/objectClasses/Message');
  const ModelHandler = require('../database/models/ourModels');
  let ModelHandlerObj = new ModelHandler().initWithConnection(db);

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