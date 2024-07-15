import { Schema, SchemaTypes, model } from 'mongoose'
import { RegisterInterface } from '../interface'

const registerSchema = new Schema<RegisterInterface>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    eventID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'events'
    }
  },
  { timestamps: true }
)

export const RegisterModel = model<RegisterInterface>(
  'register',
  registerSchema
)
