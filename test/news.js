const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../app');
const { response } = require('express');

chai.should();
chai.use(chaiHttp);

describe("News APIs", () => {
  let userToken;
  let user = {
    userName: 'test',
    email: 'test@test.com',
    birthDate: '2020-06-07T22:00:00.000+00:00'
  }
  let allnews;
  let validNew;

  describe("User APIs", () => {
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
    })

  })


  describe("Get all news from NewsAPI /news/", () => {
    it("Should get statusCode=200, as the API get business and sports news in EGY and UAE", function (done) {
      this.timeout(10000);
      chai.request(server)
        .get('/news/')
        .set('content-type', 'application/json')
        .end((err, response) => {
          response.should.status(200);
          response.body.should.be.a('array');
          response.body.length.should.eq(4)
          allnews = response.body;
          newsFilter()
          done()
        })
    })
  })


  describe("Save /news/save", () => {
    it("Should get statusCode=200, as the new saved in my favorites list successfully.", function (done) {
      this.timeout(10000);
      chai.request(server)
        .post('/news/save')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validNew)
        .end((err, response) => {
          response.should.status(200);
          response.body.should.be.a('object');
          response.body.should.have.property('_id')
          validNew.id = response.body._id;
          done()
        })
    })

    it("Should get statusCode=400, as all attributes of new are not valid.", function (done) {
      let invalidNewData = JSON.parse(JSON.stringify(validNew))
      delete invalidNewData.title

      this.timeout(10000);
      chai.request(server)
        .post('/news/save')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidNewData)
        .end((err, response) => {
          response.should.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Bad request')
          done()
        })
    })

    it("Should get statusCode=401, as user is not authorized.", function (done) {
      this.timeout(10000);
      chai.request(server)
        .post('/news/save')
        .set('content-type', 'application/json')
        .send(validNew)
        .end((err, response) => {
          response.should.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Unauthorized request')
          done()
        })
    })
  })

  describe("Favorites /news/fav",()=>{
    it("Should get statusCode=200, as user token is sent and get the favorite news list successfully",function(done){
      this.timeout(10000)
      chai.request(server)
        .get('/news/fav')
        .set('content-type','appilcation/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, response) => {
          response.should.status(200);
          response.body.should.be.a('array')
          response.body.length.should.eq(1)
          done()
        })
    })

    it("Should get statusCode=401, as user is not authorized",function(done){
      this.timeout(10000)
      chai.request(server)
        .get('/news/fav')
        .set('content-type','appilcation/json')
        .end((err, response) => {
          response.should.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Unauthorized request')
          done()
        })
    })
  })


  describe("Delete /news/delete", () => {
    it("Should get statusCode=200, as new deleted successfully", function (done) {
      this.timeout(1000)
      chai.request(server)
        .delete(`/news/delete/${validNew.id}`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${userToken}`)
        .end((err, response) => {
          response.should.status(200);
          response.body.should.have.property('msg')
          response.body.msg.should.eq('New deleted successfully')
          done();
        })
    })


    it("Should get statusCode=401, as user is not authorized.", function (done) {
      this.timeout(10000);
      chai.request(server)
        .delete(`/news/delete/${validNew.id}`)
        .set('content-type', 'application/json')
        .end((err, response) => {
          response.should.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('msg')
          response.body.msg.should.eq('Unauthorized request')
          done()
        })
    })

  })

  describe("User APIs", () => {
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
  function newsFilter() {
    let newsArray = [...allnews[0], ...allnews[1], ...allnews[2], ...allnews[3]]
    for (let newData of newsArray) {
      if (newData.source.name && newData.author && newData.title && newData.description && newData.url && newData.urlToImage && newData.publishedAt) {
        validNew = newData;
        break;
      }
      console.log(newData.title)
    }
  }
})