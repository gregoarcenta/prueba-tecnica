import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path:"",
    redirectTo:"products",
    pathMatch:"full"
  },
  {
    path:"products",
    loadComponent: () => import('./pages/products/products.component')
  },
  {
    path:"add-product",
    loadComponent: () => import('./pages/add-products/add-products.component')
  },
  {
    path:"**",
    loadComponent: () => import('./pages/404/404.component')
  }
];
