import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  addProduct(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}`, formData, { headers });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getVariants(productId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/variants`);
  }

  addVariant(productId: string, variantData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/${productId}/variants`, variantData, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  addToCart(data: any): Observable<any> {
    return this.http.post('/api/cart/add', data, {
      withCredentials: true,
    });
  }
  updateProduct(productId: string, formData: FormData) {
    return this.http.put(`${this.apiUrl}/${productId}`, formData);
  }

  deleteProduct(productId: string) {
    return this.http.post(`/api/products/${productId}/delete`, {});
  }

  deleteImage(productId: string, imageUrl: string) {
    console.log(imageUrl);
    return this.http.delete(`/api/products/${productId}/images/delete`, { body: { imageUrl } });

  }

  updateVariant(productId: string, variantId: string, data: any) {
    return this.http.put(`/api/products/${productId}/variants/${variantId}`, data);
  }

  deleteVariant(productId: string, variantId: string) {
    return this.http.delete(`/api/products/${productId}/variants/${variantId}`);
  }
  getByCategory(categoryId: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/category/${categoryId}`);
  }
  
  getSomeProducts(limit: number) {
    return this.http.get<any>(`${this.apiUrl}/some/${limit}`);
  }
  
  


}