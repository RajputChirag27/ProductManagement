import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { UserServices } from '../services'
import { controller, httpPost, httpGet } from 'inversify-express-utils'
import { TYPES } from '../utils/types'
import { UserInterface } from '../interface'
import { STATUS_CODE } from '../utils/constant'
import { SUCCESS_MESSAGE } from '../utils/constant'
import { Auth } from '../middleware/auth'
import { UserQuery } from '../query'
import { ApiHandler } from '../helpers/apiHandler'
import CustomError from '../helpers/customError'

@controller('/user')
export class UserController {
  private userServices: UserServices
  private userQuery: UserQuery

  constructor(
    @inject(TYPES.UserServices) userServices: UserServices,
    @inject(TYPES.UserQuery) userQuery: UserQuery
  ) {
    this.userServices = userServices
    this.userQuery = userQuery
  }

  @httpPost('/insert-user')
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { firstName, lastName, email, password, mobile, role, isdeleted } =
        req.body
      const body: UserInterface = {
        firstName,
        lastName,
        email,
        password,
        mobile,
        role,
        isdeleted
      }
      const user = await this.userServices.userData(body)
      if (user)
        res
          .status(STATUS_CODE.OK)
          .json(new ApiHandler(user, 'User Added Successfully'))
      else
        throw new CustomError(
          'Error',
          STATUS_CODE.BAD_REQUEST,
          'User Not Created'
        )
    } catch (err) {
      next(err)
      ////console.log(err)
    }
  }

  @httpPost('/login')
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body
      //console.log(email, password)
      const token = await this.userServices.login(email, password)
      //console.log(token)
      res.cookie('token', token, { secure: false, httpOnly: true })
      res.status(STATUS_CODE.OK).json({ token, message: SUCCESS_MESSAGE })
    } catch (err) {
      next(err)
    }
  }

  @httpGet('/hello')
  async hello(req: Request, res: Response, next: NextFunction) {
    res.send({ hello: 'Hello' })
  }

  @httpPost('/update-user/:id', Auth)
  async updateData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const update: any = req.find
      const id = req.params.id
      const { ...updateData } = req.body
      if (update.id === id) {
        const result = await this.userServices.updateUser(id, updateData)
        res.send(result)
        return
      } else {
        res.send('you can not update other profile')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  @httpPost('/delete-user/:id', Auth)
  async DeleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const del: any = req.find
      const id = req.params.id

      if (del.id === id || del.role === 'admin') {
        await this.userServices.deleteUser(id)
        res.send('SUCCESSFULLY DELETED')
        return
      } else {
        res.send('you can not delete other profile')
        return
      }
    } catch (err) {
      next(err)
    }
  }

  @httpGet('/find-user/:id', Auth)
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const find: any = req.find
      const { _id } = req.params
      if (find.id === _id) {
        const users = await this.userServices.findUser(_id)
        res.json({ users })
      } else if (find.role === 'admin') {
        const { filter, search, page = 1, limit = 10 } = req.query
        const { users, total_pages } = await this.userQuery.findAll(
          filter as string,
          search as string,
          +page,
          +limit
        )
        res.status(STATUS_CODE.OK).json({
          total_pages,
          current_page: page,
          users
        })
      } else {
        res.send('Wrong user ID')
      }
    } catch (err) {
      next(err)
    }
  }

  @httpGet('/profile', Auth)
  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const find: any = req.find
      // const { _id } = req.params
      if (find.id) {
        const users = await this.userServices.findUser(find.id)
        if (users) {
          res
            .status(STATUS_CODE.OK)
            .json(new ApiHandler(users, 'Profile Fetched Succesfully'))
        }
      } else {
        throw new CustomError(
          'NotFound',
          STATUS_CODE.NOT_FOUND,
          'User Not Found'
        )
      }
    } catch (err) {
      next(err)
    }
  }
}
