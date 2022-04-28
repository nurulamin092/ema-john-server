const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://dbJohn1:eMl7tC2CfaVv8kJc@cluster0.gxbpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxbpc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('emaJohn').collection('product');

        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productsCollection.find(query);
            let products;
            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();

            }
            else {
                products = await cursor.toArray();

            }
            res.send(products)
        });

        app.get('/productCount', async (req, res) => {
            const count = await productsCollection.estimatedDocumentCount();
            res.send({ count });
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('john is running waiting for ema');
});

app.listen(port, () => {
    console.log('john is running on is  port', port);
})