import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileUploadError } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

import Task from 'App/Models/Task'
import TaskFile from 'App/Models/TaskFile'
import File from 'App/Models/File'

export default class TasksController {
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

    const imageErros: Array<FileUploadError[]> = []

    for await (let image of images) {
      if (image && !image.isValid) {
        imageErros.push(image.errors)
      } else {
        await image.move(Application.tmpPath('uploads'), { name: `${uuidv4()}-${image.fileName}` })
      }
    }

    if (imageErros.length > 0) {
      return imageErros
    }

    await request.validate({ schema: schemaValidator })

    const task = await Task.create({
      name,
      description,
      projectId,
    })

    await Promise.all(
      images.map(async (image) => {
        const file = await File.create({
          fileUrl: Application.tmpPath('uploads'),
        })

        await TaskFile.create({
          taskId: task.id,
          fileId: file.id,
        })
      })
    )

    return task
  }
}
