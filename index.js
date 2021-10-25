const server = require('ws').createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    path: '/socket',
  },
});

const PORT = 3001;
const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';

io.on('connection', (socket) => {
  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log('New message', data);
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
