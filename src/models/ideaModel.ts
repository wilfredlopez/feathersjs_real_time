import mongoose, { Document, Model } from "mongoose"

import { Id } from "@feathersjs/feathers"

export interface Idea extends Document {
  id: Id
  text: string
  tech: string
  viewer: string
  time?: string
}

const Schema = mongoose.Schema

const IdeaSchema = new Schema<Idea>({
  text: {
    type: String,
    required: true,
  },
  tech: String,
  viewer: String,
  time: {
    type: Date,
    default: Date.now(),
  },
})

const IdeaModel = mongoose.model<Idea>("Idea", IdeaSchema)

export default IdeaModel
