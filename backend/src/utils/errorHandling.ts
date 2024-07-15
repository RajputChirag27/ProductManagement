import { Request, Response, NextFunction } from 'express'
import { injectable } from 'inversify'
import { STATUS_CODE } from './constant'

@injectable()
export class ErrorHandler {
  public handleErrors(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    try {
      console.error('Custom Error Handler =>', {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        stack: err.stack
      })

      if (err.code && err.code === 11000) {
        // Mongoose duplication error
        const duplicateField = Object.keys(err.keyValue).join(', ')
        const message = `Duplicate field value entered for: ${duplicateField}. Please use another value!`

        return res.status(STATUS_CODE.BAD_REQUEST).json({
          success: false,
          error: message,
          errorName: 'DuplicateFieldError',
          message: message
        })
      }

      return res
        .status(err.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          error: err.message,
          errorName: err.name,
          message: err.message
        })
    } catch (error) {
      next(error) // Forward the error to the next error handler
    }
  }
}
