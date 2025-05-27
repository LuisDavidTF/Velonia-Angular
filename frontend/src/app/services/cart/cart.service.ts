import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = '/api/cart';

  constructor(private http: HttpClient) { }


  getCartItems(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }


  updateItemQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { itemId, quantity });
  }

  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`);
  }

  checkout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, {});
  }

  clearCart() {
    const token = localStorage.getItem('token'); // o donde lo estés guardando

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.apiUrl}/clear/all`, { headers });
  }
}
