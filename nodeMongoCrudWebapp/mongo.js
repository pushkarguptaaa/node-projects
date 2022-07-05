const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const router = express.Router();
const app = express();
const url = require("./secret.js");
const { ObjectId } = require("mongodb");
app.use(bodyParser.json());

// MongoClient.connect(url, (err, db) => {
//   if (err) throw err;
//   console.log("connected");
//   db.close();
// });

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// client.connect((err) => {
//   const coll = client.db("people").collection("friends");
//   console.log("ready");
//   const myObj = { name: "Pushkar" };
//   coll.insertOne(myObj, (err, res) => {
//     console.log("inserted");
//     client.close();
//   });
// });

client.connect((err) => {
  const myDb = client.db("people").collection("friends");
  app
    .get("/user/:name", (req, res) => {
      console.log(req.params);
      myDb
        .find(req.params)
        .toArray()
        .then((results) => {
          console.log(results);
          res.contentType("application/json");
          res.send(JSON.stringify(results));
        });
    })

    .route("/users")
    .get((req, res) => {
      myDb
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
          res.contentType("application/json");
          res.send(JSON.stringify(results));
        });
    })
    .post((req, res) => {
      console.log(req.body);
      myDb.insertOne(req.body).then((results) => {
        console.log(req.body);
        res.contentType("application/json");
        res.send(JSON.stringify(req.body));
      });
    })
    .put((req, res) => {
      console.log(req.body);
      myDb
        .findOneAndUpdate(
          { _id: ObjectId(req.body._id) },
          {
            $set: {
              name: req.body.name,
            },
          },
          {
            upsert: false,
          }
        )
        .then((results) => {
          res.contentType("application/json");
          res.send(JSON.stringify(req.body));
        });
    })
    .delete((req, res) => {
      console.log(req.body);
      myDb
        .deleteOne({
          _id: ObjectId(req.body._id),
        })
        .then((result) => {
          let boo = true;
          if (result.deletedCount === 0) {
            boo = false;
          }
          res.send({ status: boo });
        })
        .catch((err) => console.log(err));
    });
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.listen(8080, () => {
  console.log("Server Running");
});
