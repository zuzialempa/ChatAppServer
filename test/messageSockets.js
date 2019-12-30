process.env.NODE_ENV = 'test';
const socketURL = 'http://localhost:5000';
const socketOptions = {
  transports: ['websocket'],
  'force new connection': true
};
const Messages = require('../db/models/Message');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');const socketClient = require('socket.io-client');
const should = chai.should();
const socketIo = require('socket.io-client');
describe('sockets on message', () => {
    let io;
    beforeEach(() => {
        io = socketIo(socketURL);
    });
    const goodMessage = {
        message: 'newMessage1',
        username: 'user1',
    }    
    it('it should receive message after post', (done) =>{
        io.on('newMessage', (args) => {
            console.log('args!!!!!')
            chai.assert(args)
            done();
        })
        chai.request(server)
        .post('/messages')
        .send(goodMessage)
        .end((err, res) => {
          res.should.have.status(200);
        });
    });

    afterEach(()=>{
        io.close();
    })
})
