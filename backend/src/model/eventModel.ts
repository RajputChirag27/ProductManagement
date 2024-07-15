import { Schema, model } from 'mongoose'
import { EventInterface } from '../interface'

const eventSchema = new Schema<EventInterface>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
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

export const EventModel = model<EventInterface>('event', eventSchema)
