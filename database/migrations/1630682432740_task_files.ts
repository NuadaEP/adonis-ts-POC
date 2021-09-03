import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TaskFiles extends BaseSchema {
  protected tableName = 'task_files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery)

      table.uuid('task_id').unsigned().references('tasks.id')
      table.uuid('file_id').unsigned().references('files.id')
      table.unique(['task_id', 'file_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
