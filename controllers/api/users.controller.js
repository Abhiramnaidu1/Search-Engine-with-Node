var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('services/user.service');
var elastic =require('elastic/elastic.functions.js')
// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.get('/verifytoken/:token',verifyToken);
router.post('/resetpassword', reset_password);
router.get('/reset', function (req, res) {
    res.render('reset');
});
router.get('/search',searchTitles)
router.get('/serp',serp)
router.get('/initial',initial)
router.get('/getbook/:_id',getTitle)
router.post('/advsearch',advsearch)
 // router.get('/bookinfo',bookinfo)
module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function registerUser(req, res) {
    userService.create(req.body)
        .then(function (obj) {

            res.send(obj);

        })

        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentUser(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    userService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    userService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function verifyToken(req,res){
    var userId = req.params.token
  userService.verifyToken(userId)
  .then(function () {
      res.status(200).redirect('/login');
  })
  .catch(function (err) {
      res.status(400).send(err);
  });
}

function reset_password(req,res) {
  var userId = req.body.username;
userService.reset(userId)
.then(function () {
    res.status(200);
})
.catch(function (err) {
    res.status(400).send(err);
});

}

function searchTitles(req,res){
  var titlename= req.query.title;
  console.log(titlename);
  elastic.searchTitles(titlename)

  .then(function (response) {
      res.status(200).send(response);
  })
  .catch(function (err) {
      res.status(400).send(err);
  });
}

function serp(req,res){

  res.render('SERP');

}

function initial(req,res){

  res.render('initial');

}

function getTitle(req,res){
  var id= req.params._id;
  console.log(id);
  elastic.getTitle(id)

  .then(function (response) {
    console.log(response)
    var book = response.hits.hits[0]._source
      console.log(book.title)
      res.status(200).render("bookinfo",{bookinfo:book});
      //.hits.hits[0]._source
      //.render('bookinfo',{book:book })

      //.send(response.hits.hits[0]._source);
  })
  .catch(function (err) {
      res.status(400).send(err);
  });
}

function advsearch(req,res){

var reqObj=req.body;
elastic.advsearch(reqObj)

.then(function (response) {
    res.status(200).send(response);
})
.catch(function (err) {
    res.status(400).send(err);
});

}
// function bookinfo(req,res){
//
// res=req
//
// .then(function (response) {
//     res.status(200).send(response);
// })
// .catch(function (err) {
//     res.status(400).send(err);
// });
//
// }
