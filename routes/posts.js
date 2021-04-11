const express = require('express');
const mongdb = require('mongodb');
const router = express.Router();

// Get Posts 
router.get('/', async (req, res) => {
    const posts = await loadPostsCollection();
    res.send(await posts.find({}).toArray());

});

// Add Posts 

router.post('/', async(req, res) => {
    const posts = await loadPostsCollection();
    await posts.insertOne({
        text: req.body.text,
        createdAt: new Date(),
        priority: req.body.priority
    });

    res.status(201).send();
});

//Delete Posts 
router.delete('/:id', async (req, res) =>{
    const posts = await loadPostsCollection();
    await posts.deleteOne({_id: new mongdb.ObjectID(req.params.id)});
    res.status(200).send();
});

async function loadPostsCollection(){
    const client = await mongdb.MongoClient.connect
    ("mongodb+srv://abc123:asher@journal.9uxae.mongodb.net/projectNotes?retryWrites=true&w=majority",
    {
        useNewUrlParser: true
    })

    return client.db('projectNotes').collection('posts');
}

module.exports = router;