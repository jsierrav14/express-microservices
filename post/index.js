const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const axios = require('axios')
const cors = require('cors');

const app = express();
app.use(bodyParser.json())
app.use(cors())
const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts/create', async (req, res) => {
    const id = randomBytes(4).toString('hex')
    const { title } = req.body;

    posts[id] = { id, title }

    try {
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'PostCreated',
            data: {
                id, title
            }
        })

        res.status(201).send(posts[id])
    } catch (error) {
       res.status(500).send(error)
    }

})

app.post('/events', (req, res) => {
    console.log('Received Event', req.body)
    res.send({})
})
app.listen(4000, () => {
    console.log('v55')
    console.log('listening on 4000')
})