import CustomError from '../helpers/customError'
import { ProductInterface } from '../interface'
import { ProductModel } from '../model'
import { injectable } from 'inversify'
import { STATUS_CODE } from '../utils/constant'

@injectable()
export class ProductServices {
  async productData(body: ProductInterface): Promise<void> {
    const { userID, image, title, description, price, quantity, categoryID } =
      body
    const newProduct = new ProductModel({
      userID,
      image,
      title,
      description,
      price,
      quantity,
      categoryID
    })
    await newProduct.save()
  }

  async getProductData(): Promise<any> {
    const productData = await ProductModel.find().populate('categoryID');
    if (!productData) {
      throw new CustomError(
        'NotFound',
        STATUS_CODE.NOT_FOUND,
        'Product not found'
      )
    }
    return productData
  }

  async getProductById(id: string): Promise<any> {
    const ProductById = await ProductModel.findById(id).populate('categoryID');
    if (!ProductById) {
      throw new CustomError(
        'NotFound',
        STATUS_CODE.NOT_FOUND,
        'Product not found'
      )
    }
    return ProductById
  }

  async updateproduct(
    id: string,
    updateData: Partial<ProductInterface>
  ): Promise<any> {
    const check = await ProductModel.findOne({ _id: id, isdeleted: true })
    if (check) {
      throw new CustomError(
        'Deleted',
        STATUS_CODE.NOT_FOUND,
        'Product Not Found'
      )
    } else {
      const result = await ProductModel.findByIdAndUpdate(id, updateData, {
        new: true
      })
      if (!result) {
        throw new CustomError(
          'NotUpdated',
          STATUS_CODE.BAD_REQUEST,
          'Product Not Updated'
        )
      }
      return result
    }
  }

  async deleteProduct(id: string): Promise<any> {
    const check = await ProductModel.findOne({ _id: id, isdeleted: true })
    if (check) {
      const message = { message: 'product already deleted' }
      return message
    } else {
      const result = await ProductModel.findByIdAndDelete(id)
      return result
    }
  }
}
