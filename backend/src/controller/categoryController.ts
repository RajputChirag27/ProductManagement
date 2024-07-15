import { CategoryServices } from '../services'
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
import { CategoryInterface } from '../interface'
import { Auth } from '../middleware/auth'
import { STATUS_CODE } from '../utils/constant'
import { CategoryQuery } from '../query'
import { upload } from '../middleware/fileUpload'
import { ApiHandler } from '../helpers/apiHandler'

@controller('/category')
export class CategoryController {
  private CategoryService: CategoryServices
  private CategoryQuery: CategoryQuery

  constructor(
    @inject(TYPES.CategoryServices) CategoryService: CategoryServices,
    @inject(TYPES.CategoryQuery) CategoryQuery: CategoryQuery
  ) {
    this.CategoryService = CategoryService
    this.CategoryQuery = CategoryQuery
  }

  @httpPost('/insert-category', Auth)
  async CategoryData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // const category: any = req.find;
      const { name } = req.body
      const body: CategoryInterface = {
        name
      }
      const data = await this.CategoryService.categoryData(body)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(data, 'Category Added Successfully'))
    } catch (err) {
      next(err) // Call errorMessage only
    }
  }

  @httpGet('/get-category', Auth)
  async getCategoryData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = await this.CategoryService.getCategoryData()
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(data, 'Category Fetched Successfully'))
    } catch (err) {
      next(err) // Call errorMessage only
    }
  }

  @httpGet('/get-Category/:id', Auth)
  async getCategoryById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.params.id
      const result = await this.CategoryService.getCategoryById(id)
      ////console.log(result)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(result, 'Category Fetched Successfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpPut('/update-Category/:id', Auth)
  async editCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const updateData = req.body
      const result = await this.CategoryService.updateCategory(id, updateData)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(result, 'Category Updated Succesfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpDelete('/delete-category/:id', Auth)
  async deleteCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params
      const result = await this.CategoryService.deleteCategory(id)
      res
        .status(STATUS_CODE.OK)
        .json(new ApiHandler(result, 'Category Deleted Successfully'))
    } catch (err) {
      next(err)
    }
  }

  @httpGet('/find-category', Auth)
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { filter, search, page = 1, limit = 10 } = req.query
      const { category, total_pages } = await this.CategoryQuery.findAll(
        filter as string,
        search as string,
        +page,
        +limit
      )
      res.json({
        total_pages,
        current_page: page,
        category
      })
    } catch (err) {
      next(err)
    }
  }
}
