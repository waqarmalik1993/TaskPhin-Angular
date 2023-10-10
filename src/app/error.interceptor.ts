import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service'
import Swal from 'sweetalert2';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                Swal.fire({
                    icon: 'error',
                    iconColor:"#d90000",
                    confirmButtonColor:"#d90000",
                    title: err.error.message,
                    allowOutsideClick: false,
                }).then(() => {
                    this.authenticationService.logout();
                    window.location.reload();
                })

            } else if (err.status == 400) {
                Swal.fire({
                    icon: 'error',
                    iconColor:"#d90000",
                    confirmButtonColor:"#d90000",
                    title: err.error.message,
                    allowOutsideClick: false,
                })
            }
            const error = err.error.message || err.statusText;
            return throwError(() => error);
        }))
    }
}