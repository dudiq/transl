import { routesManager } from './routes-manager'
import { getEventsRoute } from './routes/get-events.route'
import { uploadRoute } from './routes/upload.route'

routesManager.addRoute({
  path: '/api/events',
  method: 'GET',
  callback: getEventsRoute,
})

routesManager.addRoute({
  path: '/api/upload',
  method: 'POST',
  callback: uploadRoute,
})
