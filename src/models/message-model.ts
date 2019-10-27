import mongoose, { Document, Model } from "mongoose"
import { MongooseServiceOptions, Service } from "feathers-mongoose/types"

type DocAndServiceOptions = Document

export interface Message extends DocAndServiceOptions {
  text: string
  username: string
  time: Date
}

const Schema = mongoose.Schema

const MessageSchema = new Schema<Message>({
  text: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now(),
  },
  username: {
    type: String,
    required: true,
  },
})

const MessageModel = mongoose.model<Message>("Message", MessageSchema)

export default MessageModel
