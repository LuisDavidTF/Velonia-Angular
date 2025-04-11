import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-edit',
  imports: [CommonModule, RouterModule,
    ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  productForm!: FormGroup;
  product: any;
  categories = [
    { id: 1, name: 'Hombres' },
    { id: 2, name: 'Mujeres' },
    { id: 3, name: 'Niños' },
    { id: 4, name: 'Niñas' }
  ];
  sizes = ['XS', 'S', 'M', 'L', 'XL'];
  productId!: string;
  selectedImages: File[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(this.productId).subscribe(product => {
      this.product = product;
      this.productForm = this.fb.group({
        name: [product.name, Validators.required],
        description: [product.description, Validators.required],
        category_id: [product.category_id, Validators.required],
        price: [product.price, [Validators.required, Validators.min(0)]],
        variants: this.fb.array(product.variants.map((v: { id: any; size: any; color: any; stock: any; }) => this.fb.group({
          id: [v.id],
          size: [v.size, Validators.required],
          color: [v.color, Validators.required],
          stock: [v.stock, [Validators.required, Validators.min(0)]]
        })))
      });
    });
  }

  get variants() {
    return this.productForm.get('variants') as FormArray;
  }

  onFileChange(event: any) {
    if (event.target.files) {
      this.selectedImages = Array.from(event.target.files);
    }
  }

  deleteImage(imageUrl: string) {
    this.productService.deleteImage(this.productId, imageUrl).subscribe(() => {
      this.product.images = this.product.images.filter((img: string) => img !== imageUrl);
    });
  }

  deleteVariant(index: number) {
    const variantId = this.variants.at(index).value.id;
    this.productService.deleteVariant(this.productId, variantId).subscribe(() => {
      this.variants.removeAt(index);
    });
  }

  confirmDelete() {
    if (confirm('¿Eliminar producto permanentemente?')) {
      this.productService.deleteProduct(this.productId).subscribe(() => {
        this.router.navigate(['/products']);
      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    const rawData = this.productForm.value;
    formData.append('name', rawData.name);
    formData.append('description', rawData.description);
    formData.append('category_id', rawData.category_id);
    formData.append('price', rawData.price);
    this.selectedImages.forEach(file => formData.append('images', file));
    formData.append('variants', JSON.stringify(rawData.variants));

    this.productService.updateProduct(this.productId, formData).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }
}
