import { NextFunction, Request, Response } from 'express'
import { inject } from 'inversify'
import { UserServices } from '../services'
import {
  controller,
  httpPost,
  httpGet,
  httpDelete,
  httpPut
} from 'inversify-express-utils'
import { TYPES } from '../utils/types'
import { UserInterface } from '../interface'
import { STATUS_CODE } from '../utils/constant'
import { SUCCESS_MESSAGE } from '../utils/constant'
import { Auth } from '../middleware/auth'
import { UserQuery } from '../query'
import { ApiHandler } from '../helpers/apiHandler'
import CustomError from '../helpers/customError'
import { upload } from '../middleware/fileUpload'

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

  @httpGet('', Auth)
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const find: any = req.find
      if (find.role === 'admin') {
        const result = await this.userServices.findUsers()
        res
          .status(STATUS_CODE.OK)
          .json(new ApiHandler(result, 'Users Fetched Successfully'))
      } else {
        throw new CustomError(
          'Invalid',
          STATUS_CODE.BAD_REQUEST,
          'Wrong user ID'
        )
      }
    } catch (err) {
      next(err)
    }
  }

  @httpPost('/insert-user', upload.single('profilePicture'))
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(req.body)
      const imagePath = (req as any).file.filename
      let { firstName, lastName, email, password, role, isdeleted } = req.body
      const mobileNo = req.body.mobile
      const parsedMobile = JSON.parse(mobileNo)

      const body: UserInterface = {
        firstName,
        lastName,
        email,
        profilePicture: imagePath,
        password,
        mobile: parsedMobile.e164Number,
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

  @httpPut('/update-user/:id', Auth)
  async updateData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const update: any = req.find
      const id = req.params.id
      console.log(id)
      console.log(req.body)
      const updateData = req.body
      const { mobile } = req.body

      if (mobile && typeof mobile === 'object' && mobile.e164Number) {
        updateData.mobile = mobile.e164Number
      } else {
        // Handle the case where mobile is not in the expected format
        throw new CustomError(
          'Invalid',
          STATUS_CODE.BAD_REQUEST,
          'Invalid mobile format'
        )
      }

      if (update.id === id || update.role === 'admin') {
        const result = await this.userServices.updateUser(id, updateData)
        res
          .status(STATUS_CODE.OK)
          .json(new ApiHandler(result, 'Profile Updated Successfully'))
      } else {
        throw new CustomError(
          'INVALID',
          STATUS_CODE.BAD_REQUEST,
          'You cannot update another profile'
        )
      }
    } catch (err) {
      next(err)
    }
  }

  @httpDelete('/delete-user/:id', Auth)
  async DeleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const del: any = req.find
      const id = req.params.id
      console.log(id)
      if (del.id === id || del.role === 'admin') {
        const result = await this.userServices.deleteUser(id)
        res
          .status(STATUS_CODE.OK)
          .json(new ApiHandler(result, 'User Deleted Successfully'))
      } else {
        throw new CustomError(
          'Unauthorized',
          STATUS_CODE.UNAUTHORIZED,
          'You must be an admin or Contact Administrator'
        )
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
      const { id } = req.params
      if (find.id === id || find.role == 'admin') {
        const users = await this.userServices.findUser(id)
        res
          .status(STATUS_CODE.OK)
          .json(new ApiHandler(users, 'User Fetched Successfully'))
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
