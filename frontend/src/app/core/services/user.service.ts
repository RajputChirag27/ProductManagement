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
    console.log('Service data', data)
    return this.http.post(`user/insert-user`, data)
  }

  getUserDetails(): Observable<any> {
    return this.http.get(`user/profile`)
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`user/find-user/${id}`)
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`user`)
  }

  updateUser(id: string, formData: any): Observable<any> {
    //console.log(id);
    //console.log("Service"+JSON.stringify(formData));
    return this.http.put(`user/update-user/${id}`, formData)
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`user/delete-user/${id}`)
  }
}
