import { ProductServices } from '../services'
import { NextFunction, Request, Response } from 'express'
import {
  controller,
  httpPost,
  httpGet,
  httpPut,
  httpDelete,
  next
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
// import {errorMessage} from '../utils/errorHandling';
import { ProductInterface } from '../interface'
import { Auth } from '../middleware/auth'
import { STATUS_CODE } from '../utils/constant'
import { ProductQuery } from '../query'
import { upload } from '../middleware/fileUpload'
import { ApiHandler } from '../helpers/apiHandler'

@controller('/product')
export class ProductController {
  private productService: ProductServices
  private productQuery: ProductQuery

  constructor(
    @inject(TYPES.ProductServices) ProductService: ProductServices,
    @inject(TYPES.ProductQuery) productQuery: ProductQuery
  ) {
    this.productService = ProductService
    this.productQuery = productQuery
  }

  @httpPost('/insert-product', Auth, upload.single('image'))
  async ProductData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const event: any = req.find
      const { title, description, price, quantity, categoryID, isdeleted } =
        req.body
      const userID = event.id
      console.log((req as any).file)
      const imagePath = (req as any).file.filename

      const body: ProductInterface = {
        userID,
        image: imagePath,
        title,
        description,
        price,
        quantity,
        categoryID,
        isdeleted
      }
      const data = await this.productService.productData(body)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(data, 'Product Added Successfully'))
    } catch (err) {
      next(err) // Call errorMessage only
    }
  }

  @httpGet('/get-product', Auth)
  async getEventData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await this.productService.getProductData()
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(data, 'Products Fetched Successfully'))
    } catch (err) {
      next(err) // Call errorMessage only
    }
  }

  @httpGet('/get-product/:id', Auth)
  async getEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id
      //console.log(id)
      const result = await this.productService.getProductById(id)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(result, 'Product Fetched Successfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpPut('/update-product/:id', Auth, upload.single('image'))
  async editTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      // console.log(id)
      const updateData = req.body
      const imagePath = (req as any).file ? (req as any).file.path : ''

      if (imagePath) {
        const removedPath = updateData.image
        updateData.image = imagePath
      } else {
        const product: any = this.productService.getProductById(id)
        updateData.image = product._id
      }
      const result = await this.productService.updateproduct(id, updateData)
      res.send(new ApiHandler(result, 'Product Updated Successfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpDelete('/delete-product/:id', Auth)
  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const result = await this.productService.deleteProduct(id)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(result, 'Product Deleted Successfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpGet('/find-product', Auth)
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query
      const { product, total_pages } = await this.productQuery.findAll(
        filter as string,
        search as string,
        +page,
        +limit
      )
      res.json({
        total_pages,
        current_page: page,
        product
      })
    } catch (err) {
      next(err)
    }
  }
}
