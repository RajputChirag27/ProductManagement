import { UserModel } from '../model'
import { injectable } from 'inversify'
import { UserInterface } from '../interface'

@injectable()
export class UserQuery {
  async findAll(
    filters: string | undefined,
    search: string | undefined,
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: UserInterface[]; total_pages: number }> {
    const filter: any = {}
    const pipeline: any[] = []

    // Construct the initial filter based on search criteria
    if (search) {
      filter.$or = [
        { fname: { $regex: search, $options: 'i' } },
        { lname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ]
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
    pipeline.push({
      $project: { fname: 1, lname: 1, email: 1, role: 1, _id: 0 }
    })
    pipeline.push({ $limit: limit })
    pipeline.push({ $skip: (page - 1) * limit })

    // Execute the aggregation pipeline
    const users = await UserModel.aggregate(pipeline)

    // Count total documents for pagination
    const totalCount = await UserModel.countDocuments(filter)
    const total_pages = Math.ceil(totalCount / limit)

    return { users, total_pages }
  }
}
