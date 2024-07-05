import { Socket, Server } from 'socket.io';

export default function socketEvents(io: Server) {
  io.on('connection', (socket: Socket) => {
    socket.on('replyAdded', ({ commentId, reply }) => {
      socket.broadcast.emit('newReply', { commentId, reply });
    });

    socket.on('replyUpdated', ({ commentId, replyId, reply }) => {
      socket.broadcast.emit('updatedReply', { commentId, replyId, reply });
    });

    socket.on('replyDeleted', ({ commentId, replyId }) => {
      socket.broadcast.emit('deletedReply', { commentId, replyId });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
