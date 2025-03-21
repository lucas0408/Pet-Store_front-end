import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products'
    },
    {
         path: 'products', 
         component: ProductsComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'users',
        component: UsersComponent
    }
];

