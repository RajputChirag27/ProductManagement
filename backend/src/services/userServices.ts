import { expiresIn, secretkey } from '../environment/env'
import { UserInterface } from '../interface'
import { UserModel } from '../model'
import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import CustomError from '../helpers/customError'
import { STATUS_CODE } from '../utils/constant'

@injectable()
export class UserServices {
  async userData(body: UserInterface): Promise<UserInterface> {
    const saltRounds = Number(process.env.SALT)
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(body.password, salt)
    body.password = hashedPassword
    const newUser = new UserModel(body)
    if (!newUser) {
      throw new CustomError(
        'UserNotCreated',
        STATUS_CODE.BAD_REQUEST,
        'Error Creating User'
      )
    }
    await newUser.save()
    return newUser
  }

  async login(email: string, password: string): Promise<string> {
    const user = await UserModel.findOne({ email, isdeleted:false });
    if (!user) {
      throw new CustomError(
        'UserNotFound',
        STATUS_CODE.BAD_REQUEST,
        'User Not Found'
      )
    }
    const check = await bcrypt.compare(password, user.password)
    if (check) {
      const role = user.role
      const id = user._id
      const token = jwt.sign({ email, id, role }, secretkey, {
        expiresIn: expiresIn
      })
      if (token) return token
      else {
        throw new CustomError(
          'TokenNotGenerated',
          STATUS_CODE.INTERNAL_SERVER_ERROR,
          'Token Not Generated'
        )
      }
    } else {
      throw new CustomError(
        'Invalid',
        STATUS_CODE.BAD_REQUEST,
        'Invalid Credentials'
      )
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<UserInterface>
  ): Promise<UserInterface | object> {
    const result = await UserModel.findOne({ _id: id, isdeleted: true })
    if (result) {
      throw new CustomError(
        'UserAlreadyDeleted',
        STATUS_CODE.NOT_FOUND,
        'User Not Found'
      )
    } else {
      const update = await UserModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      return update
    }
  }

  async deleteUser(_id: string): Promise<UserInterface | object> {
    const result = await UserModel.findOne({ _id: _id, isdeleted: true })

    if (result) {
      throw new CustomError(
        'Deleted',
        STATUS_CODE.BAD_REQUEST,
        'Your Product is already deleted'
      )
    } else {
      const delete1 = await UserModel.findByIdAndUpdate(_id, {
        isdeleted: true
      })
      return delete1
    }
  }

  async findUser(id: string): Promise<void | object> {
    const user = await UserModel.findOne({ _id: id })
    if (!user) {
      throw new CustomError(
        'UserNotFound',
        STATUS_CODE.BAD_REQUEST,
        'User Not Found'
      )
    } else {
      return user
    }
  }

  async findUsers(): Promise<void | object[]> {
    const user = await UserModel.find({ isdeleted: false })
    if (user) {
      return user
    } else {
      throw new CustomError(
        'UserNotFound',
        STATUS_CODE.BAD_REQUEST,
        'Users Not Found'
      )
    }
  }
}
