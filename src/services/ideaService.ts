import {
  ServiceMethods,
  Params,
  NullableId,
  Id,
  Application,
} from "@feathersjs/feathers"
import IdeaModel, { Idea } from "../models/ideaModel"

class IdeaService implements ServiceMethods<any> {
  ideas: Idea[]
  constructor() {
    this.ideas = []
  }

  async find() {
    const ideas = await IdeaModel.find()
    this.ideas = ideas
    return ideas
  }

  async create(data: { text: string; tech: string; viewer: string }) {
    const idea: Idea = await IdeaModel.create({
      text: data.text,
      tech: data.tech,
      viewer: data.viewer,
    })

    await idea.save()

    this.ideas.push(idea)
    return idea
  }

  async get(id: Id, params: Params) {
    const one = await IdeaModel.findOne(id)

    return one
  }

  async update(id: NullableId, data: any, params: Params) {
    const message = await IdeaModel.updateOne(id, data)

    return message
  }
  async patch(id: NullableId, data: any, params: Params) {}
  async remove(id: NullableId, params: Params) {
    const toRemove = await IdeaModel.findOneAndRemove(
      {
        id,
      },
      { rawResult: true },
    )

    return toRemove
  }
  setup(app: Application, path: string) {
    app.use(path, new IdeaService())
  }
}

export default IdeaService
