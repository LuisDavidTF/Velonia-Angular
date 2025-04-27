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
import { IndexProfileComponent } from './profile/index/index.component';
import { EditComponent } from './products/edit/edit.component';
import { EditProfileComponent } from './profile/edit/edit.component';
import { authGuard } from './auth.guard';
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path:'cart',component:IndexComponent, canActivate:[authGuard]},
      { path:'products/add',component:AddComponent, canActivate:[authGuard]},
      { path:'product/:id',component:DetailComponent},
      { path: 'products/:id/add-variants',component: AddVariantsComponent, canActivate:[authGuard]},
      { path: 'category/:id', component: CategoryComponent },
      { path: 'profile', component:IndexProfileComponent, canActivate:[authGuard]},
      { path: 'products/:id/edit',component:EditComponent, canActivate:[authGuard]},
      { path: 'profile/edit', component:EditProfileComponent, canActivate:[authGuard]}
    ]
  },
  { path: '**', redirectTo: '' }
];
