const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const { response } = require('express');

chai.should();
chai.use(chaiHttp);

describe("User APIs", () => {
  let userToken;
  let user = {
    userName: 'test',
    email: 'test@test.com',
    birthDate: '2020-06-07T22:00:00.000+00:00'
  }
  describe("Register /user/register", () => {
    it("Should get statusCode=200, as user registered successfully. (password for testing)", function (done) {
      this.timeout(10000);
      chai.request(server)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send(user)
        .end((err, response) => {
          response.should.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Please check your mail')
          response.body.should.have.property('password')
          user.password = response.body.password;
          done();
        })
    })

    it("Should get statusCode=409, as the email is already exist", function (done) {
      this.timeout(10000);
      chai.request(server)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send(user)
        .end((err, response) => {
          response.should.status(409);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('The email is already exsit')
          done();
        })
    })

    it("Should get statusCode=400, as not all attributes are valid", function (done) {
      let invalidUserData = JSON.parse(JSON.stringify(user))
      invalidUserData.userName = undefined;
      this.timeout(10000);
      chai.request(server)
        .post('/user/register')
        .set('content-type', 'application/json')
        .send(invalidUserData)
        .end((err, response) => {
          response.should.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Bad request')
          done();
        })
    })
  })

  describe("Login /user/login", () => {
    it("Should get statusCode=200, as user logged in successfully.", function (done) {
      this.timeout(10000)
      chai.request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send(user)
        .end((err, response) => {
          response.should.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('token');
          response.body.should.have.property('userName');
          response.body.should.have.property('id');
          userToken = response.body.token;
          user.id = response.body.id
          done();
        })
    })

    it("Should get statusCode=401, as user email is invalid.", function (done) {
      let invalidUserData = JSON.parse(JSON.stringify(user))
      invalidUserData.email = 'notExistEmail@name.com';
      this.timeout(10000)
      chai.request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send(invalidUserData)
        .end((err, response) => {
          response.should.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.msg.should.eq('Invalid email')
          done();
        })
    })

    it("Should get statusCode=401, as user password is invalid.", function (done) {
      let invalidUserData = JSON.parse(JSON.stringify(user))
      invalidUserData.password = 'invalidPass';
      this.timeout(10000)
      chai.request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send(invalidUserData)
        .end((err, response) => {
          response.should.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('msg');
          response.body.msg.should.eq('Invalid password')
          done();
        })
    })

    it("Should get statusCode=400, as not all attributes are valid", function (done) {
      let invalidUserData = JSON.parse(JSON.stringify(user))
      invalidUserData.email = undefined;
      this.timeout(10000);
      chai.request(server)
        .post('/user/login')
        .set('content-type', 'application/json')
        .send(invalidUserData)
        .end((err, response) => {
          response.should.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Bad request')
          done();
        })
    })
  })


  describe("Delete /user/delete (for testing)", () => {
    it("Should get statusCode=200, as user deleted successfully", function (done) {
      this.timeout(1000)
      chai.request(server)
        .delete(`/user/delete/${user.id}`)
        .set('content-type', 'application/json')
        .end((err, response) => {
          response.should.status(200);
          response.body.should.have.property('msg')
          response.body.msg.should.eq('User deleted successfully')
          done();
        })
    })
  })
})