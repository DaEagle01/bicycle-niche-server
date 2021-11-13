const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
// middlewire
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dngm2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("bicycleHub");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");

    // app.get to get all products
    app.get("/products", async (req, res) => {
      const result = await productCollection.find({}).toArray();
      res.json(result);
    });

    // add a product to the database
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product, "aise product");
      const result = await productCollection.insertOne(product);
      res.json(result);
      console.log(result);
    });

    // app.get to get single bike data
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.json(result);
    });

    // app.get to get all the reviews
    app.get("/reviews", async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.json(result);
    });

    // app.post to order bike
    app.post("/products/:id", async (req, res) => {
      console.log("lagse vai ");
      const result = await orderCollection.insertOne(req.body);
      res.json(result);
    });

    // update a product
    app.put("/products/:id", async (req, res) => {
      console.log(req.params.id);
    });

    // add users to the database
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.json(result);
      console.log(result);
    });

    // check if the use have already been added to the database or not and if added, then do nothing.
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log(result);
    });

    // make a user admin by giving it admin role
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      console.log(user.user);
      const filter = { email: user.user };
      const options = { upsert: true };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
      console.log(result);
    });

    // get all the users
    app.get("/users", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email, "lagse vai");
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // get all the orders
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find({}).toArray();
      res.json(result);
    });

    // get a single order
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
      console.log(result);
    });

    // delete a product
    app.get("/products/:id", async (req, res) => {
      console.log(req, "delete product");
      // const id = req.params._id;
      // const query = { _id: ObjectId(id) };
      // const result = await productCollection.deleteOne(query);
      // res.json(result);
      // console.log(result);
    });

    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email, "touched");
      const query = { email: email };
      const result = await orderCollection.find(query).toArray();
      res.json(result);
      // console.log(result);
    });

    // change status of an order
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: { status: updateStatus.status } };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
      console.log(result);
    });

    // delete an order
    app.delete("/orders/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });

    // give review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      res.json(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
