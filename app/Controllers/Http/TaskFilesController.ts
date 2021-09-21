import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import File from 'App/Models/File'

import TaskFile from 'App/Models/TaskFile'
import { CreateTaskFileService } from 'App/Services/Task/CreateTaskFileService'

export default class TaskFilesController {
  public async create({ request }: HttpContextContract): Promise<TaskFile[]> {
    const taskId = request.param('taskId')
    const images = request.files('image', {
      size: '2mb',
      extnames: ['jpg', 'png'],
    })

    const createTaskFileService = new CreateTaskFileService()

    const createTaskFile = await createTaskFileService.execute({
      taskId,
      files: images,
    })

    return createTaskFile
  }

  public async delete({ request }: HttpContextContract): Promise<boolean> {
    const { taskId, fileId } = request.params()

    await Promise.all([
      TaskFile.query().where('taskId', taskId).andWhere('fileId', fileId).delete(),
      File.query().where('fileId', fileId).delete(),
    ])

    return true
  }
}
