const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.k5fnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const database = client.db('travelAlly');
        const servicesCollection = database.collection('services');

        //GET Services API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // //POST API
        // app.post('/services', async (req, res) => {
        //     const service = req.body;
        //     console.log('hit the post api', service);

        //     const result = await servicesCollection.insertOne(service);
        //     console.log(result);
        //     res.json(result)

        // })
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Travel Ally is Running');
});

app.listen(port, () => {
    console.log('Travel Ally is running on port', port);
})
