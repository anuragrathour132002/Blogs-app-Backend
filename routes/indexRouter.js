const express = require('express')
const { currentUser, signUp, login,logout} = require('../controllers/indexController')
const { isAuthenticated } = require('../middlewares/auth')
const router = express.Router()


router.post('/signup', signUp)

router.post('/login', login)

router.get('/logout', logout)

router.post('/currentUser', isAuthenticated, currentUser)


module.exports=router