import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.fetchProduct();
    this.fetchVariants();
  }

  fetchProduct(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (res) => {
        this.product = res.data;
        this.images = this.product.images ? this.product.images.split(',') : [];
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }

  fetchVariants() {
    this.productService.getVariants(this.productId).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        // Verifica si la respuesta tiene la propiedad 'variants' que es un arreglo
        if (Array.isArray(res.data)) {
          this.variants = res.data; // Asigna solo las variantes
          this.updateSizeColorOptions();
        } else {
          this.variants = []; // Si no es un arreglo, asigna un arreglo vacío
          console.warn('No se encontraron variantes o el formato es incorrecto');
        }
      },
      error: (err) => {
        console.error(err);
        this.variants = []; // Asegúrate de tener un arreglo vacío en caso de error
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
    // Trigger Angular change detection manually if needed
  }

  addToCart(): void {
    // Lógica para añadir al carrito (opcional, según cómo lo manejes en el backend)
    console.log('Añadir al carrito:', {
      productId: this.productId,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity,
    });
  }
}
