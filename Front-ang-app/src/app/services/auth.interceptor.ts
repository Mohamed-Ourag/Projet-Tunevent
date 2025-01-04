import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Liste des chemins à exclure (basée sur des regex)
    const excludedPaths = [/\/login$/, /\/signup$/];

    // Vérifiez si l'URL fait partie des chemins exclus
    if (excludedPaths.some(path => path.test(req.url))) {
      return next.handle(req); // Ne pas modifier les requêtes exclues
    }

    const token = this.authService.getToken();

    if (token) {
      // Vérifiez si le token est expiré
      if (this.authService.isTokenExpired(token)) {
        // Rafraîchir le token si nécessaire
        return this.authService.refreshToken().pipe(
          switchMap(() => {
            const updatedToken = this.authService.getToken();
            if (updatedToken) {
              // Ajouter le nouveau token à la requête
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${updatedToken}`,
                },
              });
              return next.handle(clonedReq);
            }
            return throwError(() => new Error('Failed to refresh token.'));
          }),
          catchError((error) => {
            console.error('Error refreshing token:', error);
            this.authService.logout();
            return throwError(() => error);
          })
        );
      }

      // Si le token n'est pas expiré, ajoutez-le à l'en-tête
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedReq);
    }

    // Si aucun token n'est disponible, continuer sans le modifier
    return next.handle(req);
  }
}
