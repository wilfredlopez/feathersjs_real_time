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
    //Last 5 messages
    const messages = await fService.Model.find({}).limit(5)
    // console.log(messages)

    //THIS SORT IS NOT NECCESARY BUT DOING IT FOR PRACTICE
    messages.sort(function(a, b) {
      if (a.time.getMilliseconds() >= b.time.getMilliseconds()) {
        return -1
      } else if (a.time.getMilliseconds() <= b.time.getMilliseconds()) {
        return 1
      } else {
        return -1
      }
    })

    this.messages = messages
    return messages
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
