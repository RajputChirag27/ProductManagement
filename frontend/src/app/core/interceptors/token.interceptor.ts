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
      catchError((returnedError: HttpErrorResponse) => {
        let errorMessage: string | null = null
        let handled = false

        if (returnedError.error instanceof ErrorEvent) {
          errorMessage = `Error: ${returnedError.error.message}`
        } else if (returnedError instanceof HttpErrorResponse) {
          errorMessage = `Error Status ${returnedError.status}: ${returnedError.error?.error || 'Unknown Error'} - ${returnedError.error?.message || 'No message available'}`
          handled = this.handleServerSideError(returnedError)
        }

        console.error(errorMessage ? errorMessage : returnedError)

        if (returnedError.status === 0)
          this.toastr.error('Internal Server Error', 'Error')
        else this.toastr.error(returnedError.error.message, 'Error')

        if (!handled) {
          if (errorMessage) {
            return throwError(errorMessage)
          } else {
            this.toastr.error('Internal Server Error', 'Error')
            return throwError('Internal Server Error')
          }
        } else {
          return of(returnedError)
        }
      })
    )
  }

  private handleServerSideError(error: HttpErrorResponse): boolean {
    let handled = false

    switch (error.status) {
      case 401:
      case 403:
        this.router.navigate(['authentication/login'])
        handled = true
        break
    }

    return handled
  }
}
