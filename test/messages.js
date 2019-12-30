process.env.NODE_ENV = 'test';
const Messages = require('../db/models/Message');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('Messages', () => {
  before((done) => {
    Messages.remove({}, (err) => {
      done();
    });
  });
  const actualDate = Date.now();
  const goodMessage = {
    message: 'newMessage1',
    username: 'user1',
    date: actualDate
  }
  const emptyMessage = {}
  const incorrectDate = {
    message: 'newMessage2',
    username: 'user2',
  }
  const incorrectMessage = {
    username: 'user3',
    date: actualDate
  }
  const incorrectUsername = {
    message: 'newMessage4',
    date: actualDate
  }

  describe('GET /messages', () => {
    it('it should return empty list', (done) => {
      chai.request(server)
        .get('/messages')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('POST /messages', () => {
    it('it should add correct message', (done) => {
      chai.request(server)
        .post('/messages')
        .send(goodMessage)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
    it('it should return 400 for empty new message', (done) => {
      chai.request(server)
        .post('/messages')
        .send(emptyMessage)
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
    it('it should return 400 for missing message', (done) => {
      chai.request(server)
        .post('/messages')
        .send(incorrectMessage)
        .end((err, res) => {
          res.should.have.status(400)
          done();
        });
    });
    it('it should return 400 for missing username', (done) => {
      chai.request(server)
        .post('/messages')
        .send(incorrectUsername)
        .end((err, res) => {
          res.should.have.status(400)
          done();
        });
    });
    it('it should return 200 for missing date', (done) => {
      chai.request(server)
        .post('/messages')
        .send(incorrectDate)
        .end((err, res) => {
          res.should.have.status(200)
          done();
        });
    });
  });

  describe('GET /messages', () => {
    it('it should return array with messages', (done) => {
      chai.request(server)
        .get('/messages')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          done();
        })
    })
  });

});
