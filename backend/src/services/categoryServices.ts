import { CategoryInterface } from '../interface'
import { CategoryModel } from '../model'
import { injectable } from 'inversify'
import { STATUS_CODE } from '../utils/constant'
import CustomError from '../helpers/customError'

@injectable()
export class CategoryServices {
  async categoryData(body: CategoryInterface): Promise<CategoryInterface> {
    const newCategory = new CategoryModel(body)
    await newCategory.save()
    if (!newCategory) {
      throw new CustomError(
        'Failed',
        STATUS_CODE.BAD_REQUEST,
        'Failed to create category'
      )
    } else {
      return newCategory
    }
  }

  async getCategoryData(): Promise<CategoryInterface[]> {
    const categoryData = await CategoryModel.find()
    if (categoryData) {
      return categoryData
    } else {
      throw new CustomError(
        'NotFound',
        STATUS_CODE.NOT_FOUND,
        'Category Not Found'
      )
    }
  }

  async getCategoryById(id: string): Promise<CategoryInterface> {
    const CategoryById = await CategoryModel.findById(id)
    if (!CategoryById) {
      throw new CustomError(
        'NotFound',
        STATUS_CODE.NOT_FOUND,
        'Category Not Found'
      )
    }
    return CategoryById
  }

  async updateCategory(
    id: string,
    updateData: Partial<CategoryInterface>
  ): Promise<any> {
    const check = await CategoryModel.findOne({ _id: id, isdeleted: true })
    if (check) {
      const message = { message: 'Category already deleted' }
      return message
    } else {
      const result = await CategoryModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      return result
    }
  }

  async deleteCategory(id: string): Promise<any> {
    const check = await CategoryModel.findOne({ _id: id, isdeleted: true })
    if (check) {
      const message = { message: 'Category already deleted' }
      return message
    } else {
      const result = await CategoryModel.findByIdAndDelete(id)
      return result
    }
  }
}
