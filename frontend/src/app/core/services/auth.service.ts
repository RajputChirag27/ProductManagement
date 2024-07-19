import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { environment } from 'src/environments/environment.development'
import { jwtDecode } from 'jwt-decode'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  isLoggedInn = new BehaviorSubject<boolean>(
    localStorage.getItem('authToken') !== null
  )

  login(data: any) {
    return this.http.post(`user/login`, data)
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token)
    this.isLoggedInn.next(true)
  }

  getToken() {
    return localStorage.getItem('authToken')
  }

  setRole(userRole: string) {
    localStorage.setItem('role', userRole)
  }

  getRole() {
    return localStorage.getItem('role')
  }

  isLoggedIn() {
    return this.isLoggedInn.asObservable()
  }

  logout() {
    localStorage.clear()
    this.isLoggedInn.next(false)
  }

  sendOtp(email: string) {
    return this.http.post(`${environment.apiUrl}/user/generateOTP`, email)
  }

  verifyOtp(otp: string) {
    return this.http.post(`${environment.apiUrl}/user/verifyOTP`, { otp })
  }

  isAdmin(): any {
    const token = localStorage.getItem('authToken')
    if (token) {
      const decode: any = jwtDecode(token)
      const role = decode.role
      return localStorage.getItem('authToken') !== null && role === 'admin'
    }
  }
}
