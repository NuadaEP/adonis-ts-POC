/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

// Route.post('/projects', )
Route.group(() => {
  Route.get('/', 'ProjectsController.index')
  Route.get('/:projectId', 'ProjectsController.show')
  Route.post('/', 'ProjectsController.create')
  Route.put('/:projectId', 'ProjectsController.update')
  Route.group(() => {}).prefix('/tasks')
}).prefix('/projects')
