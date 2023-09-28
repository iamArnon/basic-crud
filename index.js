const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log('running');
  console.log(`Example app listening at  http://localhost:${port}`)
  
})
const { MongoClient } = require("mongodb");
// import { MongoClient } from "mongodb";
// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://myUserAdmin:myUserAdmin@localhost:27017";

app.post('/users/create',async(req, res) => {
    
    const user = req.body;
    const client = new MongoClient(uri); //เชื่อมตัวแปลฐานข้อมูล mongo db ด้วยตัวแปร client 
    await client.connect();
    await client.db("mydb").collection("users").insertOne({
        id: parseInt(user.id),
        fname: user.fname,
        lname : user.lname,
        username: user.username,
        email:user.email,
        avatar:user.avatar
    })
    await client.close();

    res.status(200).send({
        "status" : "ok",
        "message" : "User with ID " + user.id + " is created",
        "user":user
    })
    
})

app.get('/users',async(req, res) => {
  const client = new MongoClient(uri); //เชื่อมตัวแปลฐานข้อมูล mongo db ด้วยตัวแปร client 
  await client.connect();
  const user = await client.db("mydb").collection("users").find({}).toArray()
  await client.close();

  res.status(200).send(user)
  console.log(user.username);
  
})


app.get('/users/:id',async(req, res) => {
  const id = parseInt(req.params.id)
  const client = new MongoClient(uri); //เชื่อมตัวแปลฐานข้อมูล mongo db ด้วยตัวแปร client 
  await client.connect();
  const user = await client.db("mydb").collection("users").findOne({"id":id})
  await client.close();

  res.status(200).send({
    "status":"ok",
    "user":user
  })
})

app.put('/users/update',async(req, res) => {
  const user = req.body
   const id = user.id
  
  // const id = parseInt(user.id);
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").updateOne({"id":id},{"$set":{
    fname : user.fname,
    lname : user.lname,
    username : user.username,
    email: user.email,
    avatar : user.avatar

  }})
  await client.close();

  res.status(200).send({
    "status":"ok",
    "message":"User with ID = " + id + " is updated.",
    "user": user
  })
  console.log(user.fname);
})

app.delete('/users/delete',async(req, res) => {
  // const id = parseInt(req.body.id);
  const id = req.body.id
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("mydb").collection("users").deleteOne({"id": id })
  await client.close();
  res.status(200).send({
    "status":"ok",
    "message":"User with ID = " + id + " is deleted."
    
  })
  console.log("fin");
})