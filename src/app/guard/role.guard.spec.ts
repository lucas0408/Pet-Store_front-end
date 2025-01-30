import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../pages/shared/models/Models';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const token = localStorage.getItem('token_angular');

    if (!token) {
      router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);
      const hasRequiredRole = decodedToken.roles.some(role => 
        allowedRoles.includes(role)
      );

      if (!hasRequiredRole) {
        router.navigate(['/unauthorized']);
        return false;
      }

      return true;
    } catch {
      router.navigate(['/login']);
      return false;
    }
  };
};