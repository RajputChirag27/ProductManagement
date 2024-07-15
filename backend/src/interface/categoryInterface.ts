import { Schema } from 'mongoose'

export interface CategoryInterface {
  name: string
  isDeleted?: boolean
}
