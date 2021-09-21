import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileUploadError } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'

import Task from 'App/Models/Task'
import { CreateTaskFileService } from 'App/Services/Task/CreateTaskFileService'

export default class TasksController {
  public async index({ request }: HttpContextContract): Promise<Task[]> {
    const projectId = request.param('projectId')

    const tasks = await Task.findMany(projectId)

    return tasks
  }

  public async show({ request }: HttpContextContract): Promise<Task> {
    const taskId = request.param('taskId')

    const task = await Task.findByOrFail('id', taskId)

    return task
  }

  public async create({ request }: HttpContextContract): Promise<Task | Array<FileUploadError[]>> {
    const projectId = request.param('projectId')
    const { name, description } = request.only(['name', 'description'])
    const images = request.files('image', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    const schemaValidator = schema.create({
      name: schema.string(),
      description: schema.string(),
    })

    const createTaskFileService = new CreateTaskFileService()

    const [, task] = await Promise.all([
      request.validate({ schema: schemaValidator }),
      Task.create({
        name,
        description,
        projectId,
      }),
    ])

    await createTaskFileService.execute({
      taskId: task.id,
      files: images,
    })

    return task
  }

  public async update({ request }: HttpContextContract): Promise<Task | Array<FileUploadError[]>> {
    const { taskId } = request.param('taskId')
    const { name, description } = request.only(['name', 'description'])

    const schemaValidator = schema.create({
      name: schema.string.optional(),
      description: schema.string.optional(),
    })

    const [, task] = await Promise.all([
      request.validate({ schema: schemaValidator }),
      Task.updateOrCreate({ id: taskId }, { name, description }),
    ])

    return task
  }

  public async delete({ request }: HttpContextContract): Promise<boolean> {
    const taskId = request.param('taskId')

    const task = await Task.findByOrFail('id', taskId)

    await task.delete()

    return true
  }
}
