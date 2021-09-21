import TaskFile from 'App/Models/TaskFile'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Application from '@ioc:Adonis/Core/Application'
import { v4 as uuidv4 } from 'uuid'
import File from 'App/Models/File'

type CreateTaskFileContract = {
  taskId: string
  files: MultipartFileContract[]
}

export class CreateTaskFileService {
  public async execute({ taskId, files: images }: CreateTaskFileContract): Promise<TaskFile[]> {
    const files = await Promise.all(
      images.map(async (image) => {
        // if (!image.isValid) {}

        await image.move(Application.tmpPath('uploads'), {
          name: `${uuidv4()}-${image.fileName}`,
        })

        const file = await File.create({
          fileUrl: `${Application.tmpPath('uploads')}/${uuidv4()}-${image.fileName}`,
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
