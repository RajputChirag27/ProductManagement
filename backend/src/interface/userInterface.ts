import { UserRole } from '../enum/enum'

export interface UserInterface {
  firstName: string
  lastName: string
  email: string
  password: string
  mobile: string
  profilePicture: string
  role: UserRole
  isdeleted?: boolean
}
