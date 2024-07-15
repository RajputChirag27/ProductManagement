import 'reflect-metadata'
import express from 'express'
import { Connection } from './config/db/connection'
import cookieParser from 'cookie-parser'
import { InversifyExpressServer } from 'inversify-express-utils'
import container from './config/inversify.config'
import path from 'path'
import cors from 'cors'
import { port } from './environment/env'
import { ErrorHandler } from './utils/errorHandling'

const db = new Connection()
db.connections()

const allowedOrigins = ['http://localhost:4200']
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

const server = new InversifyExpressServer(container)
server.setConfig(app => {
  app.use(cors(corsOptions))
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
  app.use(express.json())
  // console.log(`${path.join(__dirname, 'uploads')}/1721026762294-333393531.jpg`);
  app.use(cookieParser())
})

// Register the error handler middleware
server.setErrorConfig(app => {
  const errorHandler = container.get<ErrorHandler>(ErrorHandler)
  app.use(errorHandler.handleErrors.bind(errorHandler))
})

const app = server.build()
app.listen(port, (): void => {
  console.log(`Server is running at port ${port}`)
})
