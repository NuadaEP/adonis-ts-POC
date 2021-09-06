import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TaskFile extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column({ columnName: 'task_id' })
  public taskId: string

  @column({ columnName: 'file_id' })
  public fileId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
