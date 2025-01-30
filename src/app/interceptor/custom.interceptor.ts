import { HttpInterceptorFn } from '@angular/common/http';

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
