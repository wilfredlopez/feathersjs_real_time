import socketio from "@feathersjs/socketio"
import feathers from "@feathersjs/feathers"
import express, { rest } from "@feathersjs/express"

import IdeaService from "./services/ideaService"

import mongoose from "mongoose"

// A module that exports your Mongoose model
import MessageService from "./services/messageService"
// import { Message } from "./models/message-model"
require("dotenv").config()
// Make Mongoose use the ES6 promise
mongoose.Promise = global.Promise

// Connect to a local database called `feathers`

const mongoURI =
  process.env.MONGO_DB_URL ||
  "mongodb+srv://<YOUR USERNAME>:<YOUR PASSWORD>@cluster0-ef6nu.mongodb.net/<YOUR DATABASE NAME>"

mongoose
  .connect(mongoURI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))

const app: express.Application<feathers.Application> = express(feathers())

//PARSE JSON
app.use(express.json())
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }))

//Config SocketIO
app.configure(socketio())

//Enable Rest Services
app.configure(rest())

//Register services
app.use("/ideas", new IdeaService())

app.use(express.static("public"))

// const messageService = MessageService

const messagesService = new MessageService()
messagesService.setup(app, "/messages")

app.use(express.errorHandler())

//New Connection
app.on("connection", conn => {
  //@ts-ignore
  app.channel("stream").join(conn)
})

//Publish event to stream
//@ts-ignore
app.publish(data => app.channel("stream"))

const PORT = process.env.PORT || 3030

app.listen(PORT).on("listening", () => console.log(`Listening on Port ${PORT}`))

//CREATING A FAKE ONE
// const ideaService: IdeaService = app.service("ideas")

// ideaService.create({
//   text: "hello",
//   tech: "this is feathers js",
//   viewer: "Wilfred",
// })

// Create a dummy Message

// messageService
//   .create({
//     text: "Message created on server",
//   })
//   .then(function(message) {
//     console.log("Created message", message)
//   })
