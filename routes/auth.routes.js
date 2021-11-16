const router = require("express").Router();
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
  })



  router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    if (username == '' || password == '') {
      res.render('auth/signup.hbs', {error: 'Please enter all fields'})
      return;
  }
  
  

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);

    UserModel.create({username, password: hash})
      .then(() => {
          res.redirect('/')
      })
      .catch((err) => {
        next(err)
      })
    
  })

  router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs')
})

router.get('/main', (req, res, next) => {
  res.render('auth/main.hbs')
})

router.post('/signin', (req, res, next) => {
  const {username, password} = req.body
  
  UserModel.find({username})
    .then((usernameResponse) => {
        if (usernameResponse.length) {
            let userObj = usernameResponse[0]

            let isMatching = bcrypt.compareSync(password, userObj.password);
            if (isMatching) {
                req.session.myProperty = userObj

                res.redirect('/private')
            }
            else {
              res.redirect('/main')
              return;
            }
        }
        else {
          res.redirect('/main')
          return;
        }
    })
    .catch((err) => {
      next(err)
    })
})

const checkLogIn = (req, res, next) => {
  if (req.session.myProperty ) {
    next()
  }
  else {
    res.redirect('/')
  }
}

router.get('/private', checkLogIn, (req, res, next) => {
  res.render('auth/private.hbs')
})

  module.exports = router;