import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add',
  imports: [CommonModule,FormsModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export class AddComponent {
  product = {
    name: '',
    category_id: '',
    description: '',
    price: ''
  };

  selectedFiles: File[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
    }
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('category_id', this.product.category_id);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    this.productService.addProduct(formData).subscribe({
      next: (response:any) => {
        const productId=response.data.productId;
        // Redirigir a la vista de variantes (puedes cambiar la ruta si es distinta)
        this.router.navigate(['/products', productId, 'add-variants']);
      },
      error: (err) => {
        console.error('Error al agregar producto:', err);
      }
    });
  }
}
