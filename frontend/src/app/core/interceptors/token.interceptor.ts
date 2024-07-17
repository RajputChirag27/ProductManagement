import { Injectable } from '@angular/core'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable, throwError, of } from 'rxjs'
import { catchError, retry } from 'rxjs/operators'
import { AuthService } from '../services/auth.service'
import { environment } from 'src/environments/environment.development'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly _authService: AuthService,
    private readonly router: Router,
    private readonly toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this._authService.getToken()

    // Clone the request to add the new headers.
    const clonedRequest = request.clone({
      setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      url: `${environment.apiUrl}/${request.url}`
    })
    console.log(clonedRequest)

    return next.handle(clonedRequest).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    )
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      // Frontend-side error
      return this.handleFrontendError(error.error)
    } else {
      // Server-side error
      return this.handleServerSideError(error)
    }
  }

  private handleFrontendError(error: ErrorEvent): Observable<any> {
    const errorMessage = `Client-side error: ${error.message}`
    console.error(errorMessage)
    this.toastr.error(errorMessage, 'Error')
    return throwError(errorMessage)
  }

  private handleServerSideError(error: HttpErrorResponse): Observable<any> {
    let errorMessage: string
    let handled = false

    if (error.status === 0) {
      // Network error or CORS issue
      errorMessage = 'Internal Server Error'
      this.toastr.error(errorMessage, 'Error')
    } else {
      // Backend returns unsuccessful response codes such as 400, 404, 500 etc.
      errorMessage = `Error Status ${error.status}: ${error.error?.message || 'Unknown Error'}`
      this.toastr.error(
        error.error?.message || 'Internal Server Error',
        'Error'
      )
      handled = this.handleAuthErrors(error)
    }

    console.error(errorMessage)

    if (!handled) {
      return throwError(errorMessage)
    } else {
      return of(error)
    }
  }

  private handleAuthErrors(error: HttpErrorResponse): boolean {
    if (error.status === 401 || error.status === 403) {
      this.router.navigate(['authentication/login'])
      return true
    }
    return false
  }
}
