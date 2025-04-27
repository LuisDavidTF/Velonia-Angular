import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';

@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {
  products: any[] = [];
  title: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = params.get('id');
      console.log('Categoría en URL:', categoryId);
      this.loadProductsByCategory(categoryId);
    });
  }

  loadProductsByCategory(categoryId: string | null) {
    
    if (!categoryId) return;

    this.productService.getByCategory(categoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res.data; 
        this.title = this.getTitleByCategoryId(categoryId);
        
      },
      error: (err) => {
        console.error('Error cargando productos por categoría:', err);
      }
    });
  }

  getTitleByCategoryId(id: string): string {
    switch (id) {
      case "man": return 'Hombres';
      case "woman": return 'Mujeres';
      case "boy": return 'Niños';
      case "girl": return 'Niñas';
      default: return 'Categoría';
    }
  }
  
  redirectToDetail(id: string){
    this.router.navigate(['/product', id]);
  }
}