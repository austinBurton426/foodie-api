const express = require("express")
const cors = require("cors")
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("./.env");
const app = express()//create variable that calls express() function
const port = process.env.PORT || 5000 //set our environment

let db_url =
"mongodb+srv://process.ENV.USERNAME:process.ENV.PASSWORD@chucky-gtnbt.mongodb.net/Foodtracker?retryWrites=true&w=majority"//my connection string
const client = new MongoClient(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
//creatig client variable that refs our database url


app.use(express.json())
app.use(cors())//middleware or as i like to treat it as the translator to two parties i.e. 
//the middle man so there can be communication

//get all foodies from the /foodies endpoit
app.get('/foodies', (req, res) => {
  client.connect (err => {
    if (!err) {//in no error, dive into collection and find our objects => 
      //into and array and call that array docs, i get my response called docs. do what i wish with it
      const collection = client.db("Foodtracker").collection("foodies");
      const results = collection.find({}).toArray((err, docs) => {
        console.log(docs);
        res.send(docs);
      });
    } else {
      console.log(err);
    }
    client.close();
  });
});


app.get("/foodies/:key/:value", (req, res) => {//more specefic path parametters. to get on single object 
  //i.e. a search (i didnot include a search yet)
  client.connect(err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = collection
        .find({ [req.params.key]: req.params.value }) 
        .toArray((err, docs) => {
          console.log(docs);
          res.send(docs);
        });
    } else {
      console.log(err);
    }
    client.close();
  });
});

app.post("/foodie", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if(!err) {
        const collection = client.db("Foodtracker").collection("foodies");
        const results = await collection.insertOne(body);
        //instead of .find() we just insertOne() as in insert one object into my database
        res.send(results.insertedId);
      }else {
        console.log(err)
      }
      
      client.close();
    });
});

app.post("/foodies", (req, res) => {
    const body = req.body;
    client.connect(async err => {
      if (!err) {
        const collection = client.db("Foodtracker").collection("foodies");
        const results = await collection.insertMany(body);//push body into collection
        //insert many instead of one. i would typically use post man when entering alot of data into my database
        res.send(results);
      } else {
        console.log(err);
      }
      client.close();
    });
});

app.put("/foodies/:ID", (req, res) => {
  const body = req.body;
  client.connect(async err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = await collection.updateOne(//updates current object by id
        { _id: ObjectId(req.params.ID) },
        { $set: body }//sets body. i kinda like to think of it as setState almost
      );
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});

//delete lead by ID
app.delete("/foodies/:ID", (req, res) => {
  client.connect(async err => {
    if (!err) {
      const collection = client.db("Foodtracker").collection("foodies");
      const results = await collection.deleteOne({//removes object from database by id
        _id: ObjectId(req.params.ID)
      });
      res.send(results);
    } else {
      console.log(err);
    }
    client.close();
  });
});


app.listen(port,() => {console.log(`Listening on port ${port}`)})
//enables us to "listen" to our port(our env me created) and upon a successful connection it will print to the console.
