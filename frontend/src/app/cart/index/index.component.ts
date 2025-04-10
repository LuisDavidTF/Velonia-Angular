import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart/cart.service';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-index',
  imports: [FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit{
  cartItems: any[] = [];
  total: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
  }


  loadCart() {
    this.cartService.getCartItems().subscribe(
    data => {
      console.log('✅ Respuesta del backend:', data); // <-- AQUI
      this.cartItems = data.cartItems;
      this.total = data.total;
    },
    error => {
      console.error('❌ Error al cargar el carrito:', error); // <-- AQUI
    }
  );
  }


  updateQuantity(item: any) {
    this.cartService.updateItemQuantity(item.id, item.quantity).subscribe(() => {
      this.calculateTotal();
    });
  }


  confirmRemoveCartItem(itemId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo de tu carrito?')) {
      this.cartService.removeItemFromCart(itemId).subscribe(() => {
        this.loadCart();
      });
    }
  }


  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }


  
}
