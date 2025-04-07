import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart/cart.service';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
@Component({
  selector: 'app-index',
  imports: [FormsModule],
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

  // Cargar los productos del carrito desde el backend
  loadCart() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  // Actualizar la cantidad del artículo en el carrito
  updateQuantity(item: any) {
    this.cartService.updateItemQuantity(item.id, item.quantity).subscribe(() => {
      this.calculateTotal();
    });
  }

  // Eliminar un artículo del carrito
  confirmRemoveCartItem(itemId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este artículo de tu carrito?')) {
      this.cartService.removeItemFromCart(itemId).subscribe(() => {
        this.loadCart();
      });
    }
  }

  // Calcular el total del carrito
  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Proceder al pago con Stripe
  
}
