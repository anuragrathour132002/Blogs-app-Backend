const express = require('express')
const {createPost,viewPost,fetchComments, addComments,deletePostById, updatePostById, getAllPosts, getPostById, searchPosts} = require('../controllers/indexController')
const { isAuthenticated } = require('../middlewares/auth')
const router = express.Router()


router.post('/create-post/:userId',isAuthenticated, createPost)

router.get('/view-posts',getAllPosts);

router.get('/view-post/:id',getPostById)

router.delete('/delete-post/:id',isAuthenticated,deletePostById)

router.put('/update-post/:id',isAuthenticated,updatePostById)

router.get('/search',searchPosts)

router.get('/fetchComments/:postId',fetchComments)

router.post('/addComments/:postId/:userId',isAuthenticated,addComments)
module.exports=router