import service, { Service } from "feathers-mongoose"
import MessagesModel, { Message } from "../models/message-model"

const fService: Service<Message> = service({
  Model: MessagesModel,
  lean: true,
  paginate: true,

  events: ["message"],
})

import {
  ServiceMethods,
  Params,
  NullableId,
  Id,
  Application,
} from "@feathersjs/feathers"

class MessageService implements ServiceMethods<any> {
  messages: Message[]
  constructor() {
    this.messages = []
  }

  async find() {
    const messages: Message[] = await fService.Model.find({})
    // console.log(messages)

    //Last 5 messages

    const limit = messages.length - 5
    const last5 = messages.filter((m, i) => i > limit)

    this.messages = last5
    return last5
  }

  async create(data: { text: string; username: string }) {
    const message = await fService.Model.create({
      text: data.text,
      username: data.username,
    })

    await message.save()

    this.messages.push(message)

    return message
    // const created = await fService.Model.create(message)

    // return created
  }

  async get(id: Id, params: Params) {
    const one = await fService.Model.findOne(id)

    return one
  }

  async update(id: NullableId, data: any, params: Params) {
    const message = await fService.Model.updateOne(id, data)

    return message
  }
  async patch(id: NullableId, data: any, params: Params) {}
  async remove(id: NullableId, params: Params) {
    const toRemove = await fService.Model.findOneAndRemove(
      {
        id,
      },
      { rawResult: true },
    )

    return toRemove
  }
  setup(app: Application, path: string) {
    app.use(path, new MessageService())
  }
}

export default MessageService
