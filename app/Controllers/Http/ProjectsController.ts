import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Project from 'App/Models/Project'

export default class ProjectsController {
  public async index(): Promise<Project[]> {
    const projects = await Project.findMany([])

    return projects
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
}
