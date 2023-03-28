import type { IncomingMessage, ServerResponse } from 'http'
import { routesManager } from './routes-manager'

export async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const routesList = routesManager.getRoutes()

  console.log('-req', {
    url: req.url,
    method: req.method,
  })

  const usedRoutes = routesList.filter((route) => {
    if (route.method !== req.method) return false
    return route.path === req.url
  })

  if (usedRoutes.length === 0) {
    res.setHeader('Content-Type', 'application/json')

    // should be less 64k
    res.writeHead(200)
    res.end(
      JSON.stringify({
        message: 'not defined path',
      })
    )
    return
  }

  const promisesList = usedRoutes.map((route) => route.callback(req, res))
  await Promise.all(promisesList)
}
