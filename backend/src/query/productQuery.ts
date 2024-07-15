import { ProductModel } from '../model'
import { injectable } from 'inversify'
import { ProductInterface } from '../interface'
import { PipelineStage } from 'mongoose'

@injectable()
export class ProductQuery {
  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ product: ProductInterface[]; total_pages: number }> {
    const filter: any = {}

    // Define lookup, unwind, and addFields stages
    const aggregationStages: PipelineStage[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userID',
          foreignField: '_id',
          as: 'user_product'
        }
      },
      {
        $unwind: {
          path: '$user_product',
          preserveNullAndEmptyArrays: true
        }
      },
      // Define project stage to include specified fields with ifNull
      {
        $project: {
          title: 1,
          description: 1,
          price: 1,
          quantity: 1
        }
      }
    ]

    // Construct the initial filter based on search criteria
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } },
        { userEmail: { $regex: search, $options: 'i' } },
        { userRole: { $regex: search, $options: 'i' } }
      ]
    }

    // Parse and apply additional filters
    if (filters) {
      const filterPairs = filters.split('&')
      filterPairs.forEach(pair => {
        const [key, value] = pair.split('=')
        if (value !== undefined) {
          filter[key] = value
        } else {
          throw new Error('Invalid key-value pair')
        }
      })
    }

    // Add match, skip, and limit stages
    aggregationStages.push(
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    )

    const [product, totalCount] = await Promise.all([
      ProductModel.aggregate(aggregationStages),
      ProductModel.countDocuments(filter)
    ])

    const total_pages = Math.ceil(totalCount / limit)

    return { product, total_pages }
  }
}
