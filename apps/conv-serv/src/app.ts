import { startServer } from './interface/start-server'
import { handleRequest } from './interface/handle-request'

startServer(handleRequest)
