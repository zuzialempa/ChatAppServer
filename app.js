const Koa = require('koa');
const Router = require('koa-router');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const socket = require('socket.io');
const mongoose = require('mongoose');
const MessageModel = require('./db/models/Message');
const app = new Koa();
const router = new Router();

mongoose.connect(process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/chatTest' : 'mongodb://localhost:27017/chat', { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('Now connected to MongoDB!'))
  .catch(err => console.error('Something went wrong', err));
const server = require('http').createServer(app.callback());

const io = new socket(server)

io.on('connection', function (socket) {
  console.log('a user connected');
});


app.use(cors());
app.use(koaBody({
  multipart: true,
}));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(logger());


server.listen(5000);

router.post('/messages',
  async (ctx, next) => {
    try {
      const newMessage = new MessageModel(ctx.request.body);
      await newMessage.save();
      io.emit('newMessage', ctx.request.body);
      ctx.status = 200; 
    }
    catch (err) {
      ctx.status = 400;
    }
    next();
  }
);

router.get('/messages',
  async (ctx, next) => {
    try {
      const messages = await MessageModel.find();
      ctx.body = messages;
      ctx.status = 200;
    }
    catch (err) {
      ctx.status = 400;
    }
    next();
  }
);

module.exports = server;
