import { HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const jwt = localStorage.getItem('NINO-MOTOR');
    if (jwt) {
      let decodedToken = JSON.parse(jwt);
      const isExpired = decodedToken && decodedToken.expired ? decodedToken.expired < Date.now() / 1000 : false;
      if (isExpired) {
        localStorage.removeItem('NINO-MOTOR');
      }

      const mytoken = req.clone({
        setHeaders: {
          Authorization: `Bearer ${decodedToken.token}`
        }
      })
      return next(mytoken);
    }
    // const token = JSON.parse(jwt!)
    // const mytoken = req.clone({
    //   setHeaders: {
    //     Authorization: `Bearer ${jwt}`
    //   }
    // })
    // return next(mytoken);
  }
  return next(req);
};
