const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors');

const {randomBytes} = require('crypto')

const app = express();
app.use(cors())
app.use(bodyParser.json());
const commentsByPostId = {};

app.get('/posts/:id/comments',(req, res)=>{
   res.send(commentsByPostId[req.params.id]|| [])
})


app.post('/posts/:id/comments',(req, res)=>{

    const commentId  = randomBytes(4).toString('hex');
    const {content} = req.body;
    const comments  =commentsByPostId[req.params.id] || []
    comments.push({id:commentId,content})
    commentsByPostId[req.params.id] = comments;
    try {
    axios.post('http://localhost:4005/events',{
        type:'CommentCreated',
        data:{
            id:commentId,
            content,
            postId:req.params.id
        }

    })



    res.send(comments)

    } catch (error) {
      //  res.status(500).send(error)
    }


})

app.post('/events',(req, res)=>{
    console.log('Received Event', req.body)
    res.send({})
})


app.listen(4001,()=>{
    console.log('listenign port 4001')
})