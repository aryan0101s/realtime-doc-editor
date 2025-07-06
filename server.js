const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

let documentContent = "";

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.emit('load-document', documentContent);

  socket.on('send-changes', (delta) => {
    documentContent = delta;
    socket.broadcast.emit('receive-changes', delta);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
