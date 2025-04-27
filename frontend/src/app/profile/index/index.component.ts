import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from 'app/services/profile/profile.service';

@Component({
  selector: 'app-index',
  imports: [CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexProfileComponent implements OnInit{
  user: any;
  userProducts: any[] = [];

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.user = res.user;
        this.userProducts = res.userProducts.map((product: Product) => {
          const firstImage = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : 'ruta/a/imagen-default.jpg'; // Ruta predeterminada si no hay imágenes
          return { ...product, image_url: firstImage };
        });
      },
      error: (err) => console.error(err)
    });
  }
  
  
  
}
interface Product {
  id: number;
  name: string;
  price: number;
  images: string; // Asumimos que `images` es una cadena separada por comas
  image_url?: string; // Esto se añadirá para la primera imagen
}

