import { CategoryModel } from '../model'
import { injectable } from 'inversify'
import { CategoryInterface } from '../interface'

@injectable()
export class CategoryQuery {
  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ category: CategoryInterface[]; total_pages: number }> {
    const filter: any = {}
    const pipeline: any[] = []

    // Construct the initial filter based on search criteria
    if (search) {
      filter.$or = [{ name: { $regex: search, $options: 'i' } }]
    }

    // Parse and apply additional filters
    if (filters) {
      const filterPairs = filters.split('&')
      filterPairs.forEach(pair => {
        //console.log(pair)
        const [key, value] = pair.split('=')
        //console.log([key, value])
        if (value != undefined) {
          filter[key] = value
        } else {
          throw new Error('enter the key pair value')
        }
      })
    }

    pipeline.push({ $match: filter })
    pipeline.push({ $limit: limit })
    pipeline.push({ $skip: (page - 1) * limit })

    // Execute the aggregation pipeline
    const category = await CategoryModel.aggregate(pipeline)

    // Count total documents for pagination
    const totalCount = await CategoryModel.countDocuments(filter)
    const total_pages = Math.ceil(totalCount / limit)

    return { category, total_pages }
  }
}
