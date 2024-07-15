import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { IEvent } from '../interfaces/IEvent'
import { environment } from 'src/environments/environment.development'

@Injectable({
  providedIn: 'root'
})
export class EventserviceService {
  private baseUrl = `category` // Change this to your actual backend URL

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-category`)
  }

  getEvent(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-Category/${id}`)
  }

  createEvent(event: IEvent): Observable<any> {
    return this.http.post(`${this.baseUrl}/insert-category`, event)
  }

  updateEvent(id: string, event: IEvent): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-Category/${id}`, event)
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-category/${id}`)
  }
}
