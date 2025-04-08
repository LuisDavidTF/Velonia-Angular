import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = '/api/cart'; // Ruta a tu API para el carrito

  constructor(private http: HttpClient) { }

  // Obtener los artículos del carrito
  getCartItems(): Observable<any> {
    const token = localStorage.getItem('token'); // o donde lo tengas almacenado
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  
    return this.http.get<any>(`${this.apiUrl}`, { headers });
  }
  

  // Actualizar la cantidad de un artículo en el carrito
  updateItemQuantity(itemId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, { itemId, quantity });
  }

  // Eliminar un artículo del carrito
  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}`);
  }

  // Proceder al pago
  checkout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, {});
  }
}
