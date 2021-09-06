import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Task from 'App/Models/Task'

export default class TasksController {
  public async create({ request }: HttpContextContract): Promise<Task> {
    const projectId = request.param('projectId')
    const { name, description } = request.only(['name', 'description'])

    const schemaValidator = schema.create({
      name: schema.string(),
      description: schema.string(),
    })

    await request.validate({ schema: schemaValidator })

    const task = await Task.create({
      name,
      description,
      projectId,
    })

    return task
  }
}
