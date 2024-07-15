import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'product'
  constructor(private http: HttpClient) {}

  getProductById(id: string): Observable<any> {
    // Simulate API call
    return this.http.get(`${this.baseUrl}/get-product/${id}`)
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-product/${id}`, data)
  }

  addProduct(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/insert-product`, data)
  }

  getProducts() {
    return this.http.get(`${this.baseUrl}/get-product`)
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-product/${id}`) // Simulate API call
  }
}
