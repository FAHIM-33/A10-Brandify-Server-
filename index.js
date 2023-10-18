const express = require('express')
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.4pbmvpd.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const productDB = client.db("productDB").collection('products')

    app.get('/product', async (req, res) => {
      let result = await productDB.find().toArray()
      res.send(result)
    })

    app.get('/product/:title', async (req, res) => {
      let brandName = req.params.title
      let query = { brand : brandName }
      const options = {
        projection: {},
      };
      let result = await productDB.find(query,options).toArray()
      res.send(result)
    })

    app.post('/product', async (req, res) => {
      let data = req.body
      let result = await productDB.insertOne(data)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send("Server is up")
})

app.listen(port, () => { console.log("Server running at:", port); })
