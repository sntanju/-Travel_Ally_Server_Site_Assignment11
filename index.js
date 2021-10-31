const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const  ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

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
        const bookingsCollection = database.collection('bookings');

        //GET Services API
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // POST Services API
        app.post('/services', async (req, res) => {
            const services = req.body;
            console.log('hit the post api', services);

            const result = await servicesCollection.insertOne(services);
            console.log(result);
            res.json(result)
        })

        
        // GET Bookings API
        app.get('/bookings', async(req, res) => {
            const cursor = bookingsCollection.find({});
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        // POST Booking API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log('hit the post api', booking);

            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        })

        // POST MyBooking API
        app.get("/mybookings/:email", async (req, res) => {
            const cursor = bookingsCollection.find({email: req.params.email});
            const bookings = await cursor.toArray();
            res.send(bookings);
          });

          //DELETE MyBooking API 
        app.delete('/mybookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })

        //DELETE Booking API 
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        })
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
