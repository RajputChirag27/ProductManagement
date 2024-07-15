import { Container } from 'inversify'
import { TYPES } from '../utils/types'
import * as controller from '../controller'
import * as services from '../services'
import { Auth } from '../middleware/auth'
import * as query from '../query'
import { ErrorHandler } from '../utils/errorHandling'

//container
const container = new Container()

//middleware
container.bind<Auth>(Auth).toSelf()

//controller
for (const i in controller) {
  const Controller = controller[i]
  container.bind<typeof Controller>(TYPES[Controller.name]).to(Controller)
}

//services
for (const i in services) {
  const Services = services[i]
  container.bind<typeof Services>(TYPES[Services.name]).to(Services)
}

//query
for (const i in query) {
  const Query = query[i]
  container.bind<typeof Query>(TYPES[Query.name]).to(Query)
}

container.bind<ErrorHandler>(ErrorHandler).toSelf()

export default container
