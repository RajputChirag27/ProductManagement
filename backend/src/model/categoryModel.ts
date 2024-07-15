import { Schema, SchemaTypes, model } from 'mongoose'
import { CategoryInterface } from '../interface'

const categorySchema = new Schema<CategoryInterface>(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export const CategoryModel = model<CategoryInterface>(
  'category',
  categorySchema
)
