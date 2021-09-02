import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Project from 'App/Models/Project'

export default class ProjectsController {
  public async create({ request }: HttpContextContract): Promise<Project> {
    const { projectName } = request.only(['projectName'])

    const project = await Project.create({
      name: projectName,
    })

    return project
  }
}
