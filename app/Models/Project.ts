import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Task from './Task'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
