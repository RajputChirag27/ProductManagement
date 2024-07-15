import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { BaseMiddleware } from 'inversify-express-utils'
import { secretkey } from '../environment/env'
import { UserModel } from '../model'
import CustomError from '../helpers/customError'

export class Auth extends BaseMiddleware {
  async handler(req: Request, res: Response, next: NextFunction) {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    } else {
      token = req.headers.authorization
    }

    if (!token) {
      next(new CustomError('AuthorizationError', 401, 'Token not Found'))
    }

    try {
      const decoded: any = jwt.verify(token, secretkey as string)

      const user = await UserModel.findById(decoded.id)
      if (!user) {
        next(
          new CustomError('NotFoundError', 404, 'No user found with this id')
        )
      }

      req.find = decoded

      next()
    } catch (error) {
      next(
        new CustomError(
          'AuthorizationError',
          401,
          'Not authorized to access this route'
        )
      )
    }
  }
}
