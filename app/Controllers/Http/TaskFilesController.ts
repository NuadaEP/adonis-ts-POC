import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { FileUploadError } from '@ioc:Adonis/Core/BodyParser'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'

import TaskFile from 'App/Models/TaskFile'
import File from 'App/Models/File'

type StoragedImage = {
  name: string
  path: string
  errors: FileUploadError[]
}

export default class TaskFilesController {
  public async create({ request }: HttpContextContract): Promise<TaskFile[]> {
    const taskId = request.param('taskId')
    const images = request.files('image', {
      size: '2mb',
      extnames: ['jpg', 'png'],
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

    const files = await Promise.all(
      images.map(async (image) => {
        const findFileByFilename = storagedImages.find(
          (img) => img.name === image.fileName
        ) as StoragedImage

        await image.move(Application.tmpPath('uploads'), { name: `${findFileByFilename.name}` })

        const file = await File.create({
          fileUrl: findFileByFilename.path,
        })

        const taskFiles = await TaskFile.create({
          taskId,
          fileId: file.id,
        })

        return taskFiles
      })
    )

    return files
  }
}
