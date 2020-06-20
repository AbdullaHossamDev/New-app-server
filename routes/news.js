const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const NewsModel = require('../model/new')
const User = require('../model/user');


const NewsAPI = require('newsapi');
const { response } = require('express');
// const newsapi = new NewsAPI('c8b98b6558554dd79bb0bc3ef5923f9c'); // for abdulla.bably
const newsapi = new NewsAPI('8514314244904de3af1a0372a76b3f1b'); // for abdovitch

function getNews(category, country) {
  return newsapi.v2.topHeadlines({
    category,
    language: 'ar',
    country
  })
}

router.get('/', (req, res) => {
  let businessEG = getNews('business', 'eg');
  let sportsEG = getNews('sport', 'eg');
  let businessAE = getNews('business', 'ae');
  let sportsAE = getNews('sport', 'ae');

  let responseArr = []

  businessEG.then(response => {
    if (response.status == 'ok') {
      responseArr.push(response.articles)
    }
    return sportsEG;
  }).then(response => {
    if (response.status == 'ok') {
      responseArr.push(response.articles)
    }
    return businessAE;
  }).then(response => {
    if (response.status == 'ok') {
      responseArr.push(response.articles)
    }
    return sportsAE;
  }).then(response => {
    if (response.status == 'ok') {
      responseArr.push(response.articles)
    }
    res.status(200).json(responseArr)
  }).catch(err => {
    res.status(500).json({ msg: 'Internal server error' })
  })
})

router.get('/fav',verifyToken, (req,res) => {
  let userId = req.user._id;

  NewsModel.find({userId},(err, news) => {
    if (err) {
      res.status(500).json({ msg: 'Internal server error' });
    } else {
      res.status(200).json(news);
    }
  })
})

router.post('/save', verifyToken, (req, res) => {
  let newData = req.body;

  if (!newData.source.name || !newData.author || !newData.title || !newData.description ||
    !newData.url || !newData.urlToImage || !newData.publishedAt) {
    res.status(400).json({ msg: 'Bad request' });
  } else {
    newData.userId = req.user._id;
    let newNew = new NewsModel(newData);
    newNew.save((err, savedNew) => {
      if (err) {
        res.status(500).json({ msg: 'Internal server error' });
      } else {
        res.status(200).json(savedNew);
      }
    })
  }
})

router.delete('/delete/:id', verifyToken, (req, res) => {
  let { id } = req.params;

  NewsModel.deleteOne({_id: id},(err, data)=> {
    if (err) {
      res.status(500).send('Internal server error');
    } else {
        res.status(200).json({msg:'New deleted successfully'})
    }   
  })
})


function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: 'Unauthorized request' })
  }
  let token = req.headers.authorization.split(' ')[1];
  if (token === 'null') {
    return res.status(401).json({ msg: 'Unauthorized request' })
  }
  let payload = jwt.verify(token, 'secretKey');
  if (!payload) {
    return res.status(401).json({ msg: 'Unauthorized request' })
  }
  let userId = payload.subject;
  User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      res.status(500).json({ msg: 'Internal server error' })
    } else {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ msg: 'Destroyed token' })
      }
    }
  });
}

module.exports = router;