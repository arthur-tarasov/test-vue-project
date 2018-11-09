const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

router.get('/campaigns/:skip', async (req, res) => {
    let skip;
    const campaigns = await loadCollection('campaign');
    if (req.params.skip === undefined) {
        skip = 0;
    } else {
        try {
            skip = parseInt(req.params.skip);
        }
        catch (e) {
            console.log(e);
            res.json({error: e.message});
        }

    }
    res.send(await campaigns.find({}).skip(skip).limit(7).toArray());
});

router.get('/campaign-count', async (req, res) => {
    const campaigns = await loadCollection('campaign');

    res.send({count: await campaigns.countDocuments({}, {skip: 7} ) });
});

router.get('/campaign/:id', async (req, res) => {
    const campaigns = await loadCollection('campaign');
    let id = null;
    try {
        id = parseInt(req.params.id);
    }
    catch (e) {
        console.log(e);
        res.json({error: e.message});
    }
    res.json(await campaigns.findOne({"id": id}));
});

router.get('/media', async (req, res) => {
    const mediaCollection = await loadCollection('media');
    let social = req.query.social;
    console.log(social);
    res.send(await mediaCollection.find({"social_network": social}).toArray());
});


async function loadCollection(collection) {
    const client = await mongodb.MongoClient.connect('mongodb://vueuser:1900iop@ds151453.mlab.com:51453/test-ad-project', {
        useNewUrlParser: true
    });

    return client.db('test-ad-project').collection(collection);
}

module.exports = router;