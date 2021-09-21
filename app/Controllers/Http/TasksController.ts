import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileUploadError } from '@ioc:Adonis/Core/BodyParser'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

import Task from 'App/Models/Task'
import TaskFile from 'App/Models/TaskFile'
import File from 'App/Models/File'

type StoragedImage = {
  name: string
  path: string
  errors: FileUploadError[]
}

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

    const storagedImages: Array<StoragedImage> = []

    for await (let image of images) {
      const imageHashedName = `${uuidv4()}-${image.fileName}`

      if (image && !image.isValid) {
        storagedImages.push({
          name: imageHashedName,
          path: `${Application.tmpPath('uploads')}/${imageHashedName}`,
          errors: image.errors,
        })
      } else {
        storagedImages.push({
          name: imageHashedName,
          path: `${Application.tmpPath('uploads')}/${imageHashedName}`,
          errors: [],
        })
      }
    }

    await request.validate({ schema: schemaValidator })

    const task = await Task.create({
      name,
      description,
      projectId,
    })

    await Promise.all(
      images.map(async (image) => {
        if (image.errors.length > 0) {
          return 'Some image does have an error'
        }

        const findFileByFilename = storagedImages.find(
          (img) => img.name === image.fileName
        ) as StoragedImage

        await image.move(Application.tmpPath('uploads'), { name: `${findFileByFilename.name}` })

        const file = await File.create({
          fileUrl: findFileByFilename.path,
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
