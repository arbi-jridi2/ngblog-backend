const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://arbijridi:arbi123456@ngblog.d0jsu.mongodb.net/ngblog?retryWrites=true&w=majority&appName=ngblog', {
    //useNewUrlParser: true,
   // useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

module.exports =mongoose ; 

/* require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
