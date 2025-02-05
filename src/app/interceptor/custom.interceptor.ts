import { HttpInterceptorFn } from '@angular/common/http';
import { JwtPayload } from '../pages/shared/models/Models';
import { jwtDecode } from 'jwt-decode';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof localStorage !== 'undefined'){
    const token = localStorage.getItem("token_angular")
    if (token) {
      const clonedReq = req.clone({
        setHeaders:{
        Authorization: `Bearer ${token} `
        }
      });
    
      return next(clonedReq);
    }
  }

  return next(req);
};
