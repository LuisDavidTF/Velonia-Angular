// app.routes.ts
import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CategoryComponent } from './products/category/category.component';
import { IndexComponent } from './cart/index/index.component';
import { AddComponent } from './products/add/add.component';
import { AddVariantsComponent } from './products/add-variants/add-variants.component';
import { DetailComponent } from './products/detail/detail.component';
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'auth/login', component: LoginComponent },
      { path: 'auth/register', component: RegisterComponent },
      { path:'cart',component:IndexComponent},
      { path:'product/add',component:AddComponent},
      { path:'product/:id',component:DetailComponent},
      { path: 'products/:id/add-variants',component: AddVariantsComponent},
      { path: 'category/:id', component: CategoryComponent }

    ]
  },
  { path: '**', redirectTo: '' }
];
