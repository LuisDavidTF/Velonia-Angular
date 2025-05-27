import { Component, OnInit } from '@angular/core';
import { CartService } from 'app/services/cart/cart.service';
import { FormsModule } from '@angular/forms';  // Importa FormsModule
import { CommonModule } from '@angular/common';
import { loadStripe } from '@stripe/stripe-js';
@Component({
  selector: 'app-index',
  imports: [FormsModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  stripePromise = loadStripe('pk_test_51RT6i04hiF2hiZYTWhU0sCvkQQatgDYJf9omNIAOzrIu2Au5czm0XFQqmGMMmDWrLuUulFI2HJYItG6U3t0pErM300Ysim97cB');

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
  async onCheckout() {
    const stripe = await this.stripePromise;

    this.cartService.checkout().subscribe(async (session) => {
      if (stripe && session.id) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.id
        });
        if (result.error) {
          console.error('❌ Error al redirigir a Stripe:', result.error.message);
        }
      }
    }, (error) => {
      console.error('❌ Error al crear sesión de Stripe:', error);
    });
  }


}
