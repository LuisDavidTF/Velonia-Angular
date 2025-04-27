import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthModalService } from 'app/services/auth-modal/auth-modal.service';
import { AuthService } from 'app/services/auth/auth.service';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-detail',
  imports: [CommonModule,FormsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css'
})
export class DetailComponent implements OnInit {
  productId!: string;
  product: any;
  variants: any[] = [];
  images: string[] = [];

  selectedSize = '';
  selectedColor = '';
  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private authService:AuthService,
    private router:Router,
    private authModal:AuthModalService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.fetchProduct();
    this.fetchVariants();
  }

  fetchProduct(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (res) => {
        this.product = res.data.product;
        console.log('Producto cargado:', this.product,this.productId);
        this.images = this.product.images ? this.product.images.split(',') : [];
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }

  fetchVariants() {
    this.productService.getVariants(this.productId).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        if (Array.isArray(res.data)) {
          this.variants = res.data; 
          this.updateSizeColorOptions();
        } else {
          this.variants = []; 
          console.warn('No se encontraron variantes o el formato es incorrecto');
        }
      },
      error: (err) => {
        console.error(err);
        this.variants = [];
      },
    });
  }

  get availableSizes(): string[] {
    const filtered = this.selectedColor
      ? this.variants.filter((v) => v.color === this.selectedColor)
      : this.variants;
    return [...new Set(filtered.map((v) => v.size))];
  }

  get availableColors(): string[] {
    const filtered = this.selectedSize
      ? this.variants.filter((v) => v.size === this.selectedSize)
      : this.variants;
    return [...new Set(filtered.map((v) => v.color))];
  }

  updateSizeColorOptions(): void {
    
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.authModal.openLogin();
      return;
    }
  
    if (!this.selectedSize || !this.selectedColor || this.quantity < 1) {
      alert('Por favor, selecciona talla, color y cantidad válida.');
      return;
    }
  
    const cartData = {
      productId: this.productId,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
    };
  
    this.productService.addToCart(cartData).subscribe({
      next: (res) => {
        console.log('Producto añadido al carrito:', res);
        alert('Producto añadido al carrito correctamente');
      },
      error: (err) => {
        console.error('Error al añadir al carrito:', err);
        alert('Ocurrió un error al añadir el producto al carrito');
      }
    });
  }
  
  
}
