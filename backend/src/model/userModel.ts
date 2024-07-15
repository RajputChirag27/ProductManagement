import { Schema, model } from 'mongoose'
import { UserInterface } from '../interface'
import { UserRole } from '../enum/enum'

const userSchema = new Schema<UserInterface>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    mobile: {
      type: String,
      unique: true,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true
    },
    isdeleted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  { timestamps: true }
)

export const UserModel = model<UserInterface>('user', userSchema)
