import { Injectable } from '@angular/core'
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router'
import { Observable } from 'rxjs'
import { AuthService } from '../services/auth.service'
import { ToastrService } from 'ngx-toastr'

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private readonly _authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this._authService.isAdmin()) {
      return true // User is authenticated, allow access
    } else {
      // User is not authenticated, redirect to login page
      // this.toastr.error("You are not Admin");
      return this.router.parseUrl('/unauthorized') // or any other route you want to redirect to
    }
  }
}
