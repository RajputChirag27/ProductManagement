import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { UserService } from 'src/app/core/services/user.service'
import { environment } from 'src/environments/environment.development'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  defaultProfile: string =
    'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png'
  result!: any
  constructor(
    private readonly _userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this._userService.getUserDetails().subscribe(
      (res: any) => {
        console.log(res)
        this.result = res.result
        this.result.profilePicture = `http://localhost:8000/uploads/${res.result.profilePicture}`
      },
      (error: any) => {
        console.error('Error fetching user profile:', error)
      }
    )
  }

  edit(id: string) {
    this.router.navigateByUrl(`/authentication/signup/${id}`)
  }
}
