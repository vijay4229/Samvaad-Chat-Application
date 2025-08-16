import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoDBConnect from './mongoDB/connection.js';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user.js';
import chatRoutes from './routes/chat.js';
import messageRoutes from './routes/message.js';
import aiRoutes from './routes/aiRoutes.js';
import * as Server from 'socket.io';

const app = express();

// --- THIS IS THE FIX ---
// We've added your live Vercel URL to the list of allowed origins
const allowedOrigins = [
    "http://localhost:3000",
    "https://samvaad-chat-application-kappa.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
// --- END OF FIX ---

const PORT=process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/ai', aiRoutes);
mongoose.set('strictQuery', false);
mongoDBConnect();
const server = app.listen(PORT, () => {
  console.log(`Server Listening at PORT - ${PORT}`);
});
const io = new Server.Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
  },
});

let onlineUsers = {};

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData.id);
    onlineUsers[userData.id] = socket.id;
    io.emit('onlineUsers', Object.keys(onlineUsers));
    socket.emit('connected');
  });

  socket.on('join room', (room) => {
    socket.join(room);
  });

  socket.on('typing', (room) => socket.in(room).emit('typing'));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

  socket.on('new message', (newMessageRecieve) => {
    var chat = newMessageRecieve.chatId;
    if (!chat.users) return;
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieve.sender._id) return;
      socket.in(user._id).emit('message recieved', newMessageRecieve);
    });
  });

  socket.on('disconnect', () => {
    let disconnectedUserId;
    for (const userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        disconnectedUserId = userId;
        delete onlineUsers[userId];
        break;
      }
    }
    if (disconnectedUserId) {
      io.emit('onlineUsers', Object.keys(onlineUsers));
    }
  });
});