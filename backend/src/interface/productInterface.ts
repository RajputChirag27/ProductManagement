import { Schema } from 'mongoose'

export interface ProductInterface {
  userID: Schema.Types.ObjectId
  image: string
  title: string
  description: string
  price: number
  quantity: number
  categoryID: Schema.Types.ObjectId
  isdeleted: boolean
}
