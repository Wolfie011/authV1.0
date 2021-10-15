const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/auth')
const secret = require('../secret.json');
const User = require('../model/user')

//REG//
router.post('/users/registration', (req, res) => {
    User.find({email: req.body.email})
        .exec()
        .then(users => { 
            if(users.length >= 1){
                return res.status(409).json({
                    message: "mail w użyciu"
                });
            }
            else{
                bcrypt.hash(req.body.password, 8, function(err, hash){
                    if(err){
                        return res.status(500).json({
                           error: err
                        })
                    }
                    else{
                        const user = new User({
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => res.sendStatus(201))
                            .catch(err => res.status(500).json({error: err}))
                   }
                })
            }
        })
})

//DELETE//
router.delete('/users/delete/:userId', checkAuth, (req, res) =>{
    User.remove({_id: req.params.userId})
        .exec()
        .then(response => {
            res.status(200).json({
                message: 'user deleted'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

//LOGIN//
router.post('/users/login', (req, res) => {
   User.find({email: req.body.email})
    .exec()
    .then( users => {
        if(users.length < 1){
            return res.sendStatus(404);
        }
        bcrypt.compare(req.body.password, users[0].password, (err, isEqual) => {
            if(err) return res.sendStatus(401);
            if(isEqual){
                //JSON-WEB-TOKEN
                //DODAĆ SECRET NA ENVPATH
                const token = jwt.sign(
                    {
                    email: users[0].email,
                    userId: users[0]._id
                    },
                    secret.key,
                    {
                        expiresIn: "1h"
                    }
                )
                return res.status(200).json({
                    message: "Authorized",
                    token: token
                })
            }
            res.sendStatus(401);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
})


module.exports = router;