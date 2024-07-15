import { Schema, model } from 'mongoose'
import { ProductInterface } from '../interface'

const productSchema = new Schema<ProductInterface>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    image: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    categoryID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'category'
    },
    isdeleted: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  { timestamps: true }
)

export const ProductModel = model<ProductInterface>('product', productSchema)
