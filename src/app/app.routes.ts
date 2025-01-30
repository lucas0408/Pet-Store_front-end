import { Routes } from '@angular/router';
import { ProductsComponent } from './pages/products/products.component';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { authGuard } from './guard/auth.guard';
import { roleGuard } from './guard/role.guard';

export const routes: Routes = [
    {
         path: 'products', 
         component: ProductsComponent,
         canActivate: [
            authGuard,
            roleGuard(['ROLE_ADMIN', 'ROLE_USER'])
        ]
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [
            authGuard,
            roleGuard(['ROLE_ADMIN'])
        ]
    }
];

