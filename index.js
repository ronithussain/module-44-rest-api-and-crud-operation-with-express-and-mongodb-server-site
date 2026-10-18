import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5000;
const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.prdzdmt.mongodb.net/`,
);

app.use(cors()); //exam:server=localhost/5000 client=localhost/3000
app.use(express.json()); // client site theke stringify data parse kore;

export async function connecToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to mongodb");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectedClient =  await connecToMongoDB();
const db = connectedClient.db('simpleCrudDb');
const users = db.collection('users')


app.get("/", (req, res) => {
  res.send("module-44-curd operation with mongodb and express");
});

app.get('/users', async(req, res) => {
    const cursor = users.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers)
})

app.get('/users/:id', async(req, res) => {
  const id = req.params.id;
  // console.log(id, 'the id is');

  const query = {_id: new ObjectId(id)};
  const result = await users.findOne(query);
  res.send(result);
})

app.delete('/users/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await users.deleteOne(query);
  res.send(result);
})

// update with patch:
app.patch('/users/:id', async(req, res) => {
  const id = req.params.id;
  const updateUser = req.body;
  // console.log('the Updated user is', id, 'and user ', updateUser );

  const filter = {_id: new ObjectId(id)};
   const options = { upsert: true };
  const updateDoc = {
    $set: {
      name:updateUser.name,
      email:updateUser.email
    }
  }
  const result = await users.updateOne(filter, updateDoc, options)
  res.send(result);
})

app.post('/users', async(req, res) => {
  const newUsers = req.body;
  console.log('the new user is', newUsers);

  const result = await users.insertOne(newUsers);
  res.send(result)
})
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
