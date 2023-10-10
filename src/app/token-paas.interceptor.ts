import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
@Injectable()
export class TokenPaasInterceptor implements HttpInterceptor {
  lang = localStorage.getItem('language')
  constructor(private authenticationService:AuthService) { }
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!)
    const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        }
      });
    }
    if (!localStorage.getItem('language')) {
      
    } else {
      request = request.clone({
        setHeaders: {
          'Accept-Language': (localStorage.getItem('language')!)
        }
      });
    }
    return next.handle(request);
  }
}
