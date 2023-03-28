import type { IncomingMessage, ServerResponse } from 'http'

type Route = {
  method: 'GET' | 'POST'
  path: string
  callback: (req: IncomingMessage, res: ServerResponse) => Promise<void>
}

class RoutesManager {
  private routes: Route[] = []

  addRoute(route: Route): void {
    console.log('register route:', route.method, route.path)
    this.routes.push(route)
  }

  getRoutes(): Route[] {
    return this.routes
  }
}

export const routesManager = new RoutesManager()
