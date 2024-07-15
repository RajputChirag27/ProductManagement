import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment.development'
import { Observable } from 'rxjs'
import { IAuth } from '../interfaces/IAuth'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  createUser(data: any): Observable<any> {
    return this.http.post(`user/insert-user`, data)
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`user/profile`)
  }
}
