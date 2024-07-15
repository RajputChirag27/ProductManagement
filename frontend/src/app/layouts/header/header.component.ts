import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from 'src/app/core/services/auth.service'
import { Input } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { UserService } from 'src/app/core/services/user.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  result!: any
  isLoggedInn: boolean = false
  defaultProfile: string =
    'https://www.kindpng.com/picc/m/252-2524695_dummy-profile-image-jpg-hd-png-download.png'
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  isAdmin: boolean = this._authService.isAdmin()
  //  isLoggedIn(){
  //   this.isLoggedInn = this._authService.isLoggedIn();
  //  }

  ngOnInit() {
    this._userService.getUserDetails().subscribe(
      (res: any) => {
        console.log(res)
        this.result = res.result
      },
      (error: any) => {
        console.error('Error fetching user profile:', error)
      }
    )
  }

  logout() {
    this._authService.logout()
    this.isLoggedInn = false
    this.toastr.info(`See you next time!!`, `Logged Out!`, {
      timeOut: 3000,
      closeButton: true,
      progressBar: true
    })
    this.router.navigate(['authentication/login'])
  }
}
