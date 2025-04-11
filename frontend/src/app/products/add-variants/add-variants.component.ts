import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-add-variants',
  imports: [CommonModule,FormsModule],
  templateUrl: './add-variants.component.html',
  styleUrl: './add-variants.component.css'
})
export class AddVariantsComponent implements OnInit {
  productId!: string;
  product: any;
  variants: any[] = [];
  sizes = ['XS', 'S', 'M', 'L', 'XL'];

  variant = {
    size: '',
    color: '',
    stock: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.fetchProduct();
    this.fetchVariants();
  }

  fetchProduct() {
    this.productService.getProduct(this.productId).subscribe({
      next: (res) => (this.product = res),
      error: (err) => console.error(err),
    });
  }

  fetchVariants() {
    this.productService.getVariants(this.productId).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        // Verifica si la respuesta tiene la propiedad 'variants' que es un arreglo
        if (Array.isArray(res.data)) {
          this.variants = res.data; // Asigna solo las variantes
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
  

  onSubmit() {
    this.productService.addVariant(this.productId, this.variant).subscribe({
      next: (res) => {
        this.variants.push(res);
        this.fetchVariants();
        this.variant = { size: '', color: '', stock: 0 };
      },
      error: (err) => console.error(err),
    });
  }
  redirectToDetail(){
    this.router.navigate(['/products', this.productId]);
  }
}
