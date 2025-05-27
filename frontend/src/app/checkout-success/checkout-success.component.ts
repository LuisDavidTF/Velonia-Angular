import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from 'app/services/cart/cart.service';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule,RouterModule],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.css'
})
export class CheckoutSuccessComponent implements OnInit {
constructor(private cartService: CartService) {}

ngOnInit() {
  // Cuando entres a esta página o evento
  this.cartService.clearCart().subscribe({
    next: () => {
      console.log('Carrito vaciado después del pago exitoso');
      // Aquí podrías mostrar mensaje, redirigir, etc
    },
    error: (err) => {
      console.error('Error al vaciar el carrito:', err);
    }
  });
}
}
