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
  title: string = 'a';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const categoryId = "man";
    console.log(categoryId);
    this.loadProductsByCategory(categoryId);
  }

  loadProductsByCategory(categoryId: string | null) {
    
    if (!categoryId) return;

    this.productService.getByCategory(categoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res.data; // depende del backend
        this.title = this.getTitleByCategoryId(categoryId);
      },
      error: (err) => {
        console.error('Error cargando productos por categoría:', err);
      }
    });
  }

  getTitleByCategoryId(id: string): string {
    switch (id) {
      case "1": return 'Hombres';
      case "2": return 'Mujeres';
      case "3": return 'Niños';
      case "4": return 'Niñas';
      default: return 'Categoría';
    } 
  }
  redirectToDetail(id: string){
    this.router.navigate(['/product', id]);
  }
}