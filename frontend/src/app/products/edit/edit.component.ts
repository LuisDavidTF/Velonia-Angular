import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  productForm!: FormGroup;
  product: any;
  variants: any[] = [];
  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  productId!: string;
  selectedImages: File[] = [];
  images: string[] = [];
  // Para agregar nuevas variantes
  variant = {
    size: '',
    color: '',
    stock: 0,
  };

  categories = [
    { id: 1, name: 'Hombres' },
    { id: 2, name: 'Mujeres' },
    { id: 3, name: 'Niños' },
    { id: 4, name: 'Niñas' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      category_id: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });

    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.fetchProduct();
    this.fetchVariants();
  }

  fetchProduct() {
    this.productService.getProduct(this.productId).subscribe(res => {
      const product = res.data.product;
      if (Array.isArray(product.images)) {
        this.images = product.images;
      } else if (typeof product.images === 'string') {
        this.images = product.images.split(',');
      } else {
        this.images = [];
      }
      this.product = product;

      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        category_id: product.category_id,
        price: product.price
      });
    });
  }

  fetchVariants() {
    this.productService.getVariants(this.productId).subscribe({
      next: (res: any) => {
        if (Array.isArray(res.data)) {
          this.variants = res.data;
        } else {
          this.variants = [];
        }
      },
      error: () => {
        this.variants = [];
      }
    });
  }

  onSubmitForm() {
    const formData = new FormData();
    const rawData = this.productForm.value;

    formData.append('name', rawData.name);
    formData.append('description', rawData.description);
    formData.append('category_id', rawData.category_id);
    formData.append('price', rawData.price);
    this.selectedImages.forEach(file => formData.append('images', file));
    console.log('Product ID:', this.productId);
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
    this.productService.updateProduct(this.productId, formData).subscribe(() => {
      window.location.reload();

    });
  }

  onVariantSubmit() {
    this.productService.addVariant(this.productId, this.variant).subscribe({
      next: () => {
        this.fetchVariants();
        this.variant = { size: '', color: '', stock: 0 };
      },
      error: (err) => console.error(err),
    });
  }

  deleteVariant(variantId: string) {
    this.productService.deleteVariant(this.productId, variantId).subscribe(() => {
      this.variants = this.variants.filter(v => v.id !== variantId);
    });
  }

  deleteImage(imageUrl: string) {
    this.productService.deleteImage(this.productId, imageUrl).subscribe(() => {
      if (Array.isArray(this.product.images)) {
        this.product.images = this.product.images.filter((img:string) => img !== imageUrl);
      }
    });
    window.location.reload();
  }

  confirmDelete() {
    if (confirm('¿Eliminar producto permanentemente?')) {
      this.productService.deleteProduct(this.productId).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
  }
}
