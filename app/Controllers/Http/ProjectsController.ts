import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProjectsController {
  public async create({ request }: HttpContextContract) {
    const data = request.only(['projectName'])
  }
}
