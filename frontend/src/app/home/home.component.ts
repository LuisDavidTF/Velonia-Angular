import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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

  readonly baseUrl = "uploads/";
  products = [
    { id: 1, name: 'Sueter', price: 0.03,  photo: `${this.baseUrl}sueter.jpg` },
    { id: 2, name: 'Blusa', price: 1200.00, photo: `${this.baseUrl}blusa.jpg` }
  ];
}
