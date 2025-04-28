import { CommonModule} from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductService } from 'app/services/product/product.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories = [
    { name: 'Hombres', photo: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=600&h=400', link: '/category/man' },
    { name: 'Mujeres', photo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&h=400', link: '/category/woman' },
    { name: 'Niños', photo: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&h=400', link: '/category/boy' },
    { name: 'Niñas', photo: 'https://images.unsplash.com/photo-1476234251651-f353703a034d?auto=format&fit=crop&w=600&h=400', link: '/category/girl' }
  ];

  readonly baseUrl = "http://localhost:3000/uploads/";
  products: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadSomeProducts();
  }

  loadSomeProducts() {
    this.productService.getSomeProducts(8).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res.data.map((p: any) => ({
          ...p,
          photo: p.images[0] ? this.baseUrl + p.images[0] : 'default-image.jpg'
        }));
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }
  scrollToCategories() {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
}
