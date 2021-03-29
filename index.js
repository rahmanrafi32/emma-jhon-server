const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@firstcluster.bte1v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send('hello emma');
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emma-jhon").collection("products");
  const shipmentInfo = client.db("emma-jhon").collection("shipment-info");

  app.post('/addProduct', (req,res)=>{
    const product = req.body;
    console.log(product);
    products.insertOne(product) 
    .then(result =>{
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.post('/addOrder', (req,res)=>{
    const order = req.body;
    console.log(order);
    shipmentInfo.insertOne(order) 
    .then(result =>{
      res.sendStatus(result.insertedCount)
    })
  })

  app.get('/products', (req,res)=>{
    products.find({}).limit(20)
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

  app.get('/products/:key', (req,res)=>{
    products.find({key:req.params.key}).limit(20)
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKyes', (req,res)=>{
    const productKeys = req.body
    products.find({key: {$in:productKeys}})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
});
app.listen(process.env.PORT || 3001);