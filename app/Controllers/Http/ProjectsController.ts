import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index(): Promise<Project[]> {
    const projects = await Project.all()

    return projects
  }

  public async show({ request }: HttpContextContract): Promise<Project> {
    const projectId = request.param('projectId')

    const project = await Project.findByOrFail('id', projectId)

    return project
  }

  public async create({ request }: HttpContextContract): Promise<Project> {
    const { projectName } = request.only(['projectName'])

    const schemaValidator = schema.create({
      projectName: schema.string(),
    })

    await request.validate({ schema: schemaValidator })

    const project = await Project.create({
      name: projectName,
    })

    return project
  }

  public async update({ request }: HttpContextContract): Promise<Project> {
    const projectId = request.param('projectId')
    const { projectName } = request.only(['projectName'])

    const project = await Project.updateOrCreate({ id: projectId }, { name: projectName })

    return project
  }
}
