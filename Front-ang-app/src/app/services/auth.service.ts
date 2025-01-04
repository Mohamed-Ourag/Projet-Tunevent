import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloakTokenUrl = 'http://localhost:8180/realms/Tunevent/protocol/openid-connect/token';
  private apiUrl = '/api/users';

  // Stockage configurable (localStorage ou sessionStorage)
  private storage = localStorage; // Changez pour sessionStorage si nécessaire

  // BehaviorSubject pour l'état utilisateur
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser)); // Initialiser l'état utilisateur à partir du localStorage
    }

    window.addEventListener('storage', (event) => {
      if (event.key === 'user' && !event.newValue) {
        // Déconnexion déclenchée dans un autre onglet
        this.logout();
      }
    });
  }


  /**
   * Login via Keycloak
   * @param username Nom d'utilisateur
   * @param password Mot de passe
   * @returns Observable<any>
   */
  login(username: string, password: string): Observable<any> {
    const body = new URLSearchParams();
    body.set('client_id', 'frontend-client');
    body.set('client_secret', 'RC9wWBfNUlDKXMgNQxP9ZVkRKrzdoIj4');
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    return this.http.post('http://localhost:8180/realms/Tunevent/protocol/openid-connect/token', body.toString(), { headers }).pipe(
      tap((response: any) => {
        // Stocker le nouveau token dans le stockage local
        this.storeTokens(response.access_token, response.refresh_token);
        console.log('Nouveau token d\'accès obtenu :', response.access_token);
      }),
      catchError((error) => {
        console.error('Échec de la connexion :', error);
        return throwError(() => new Error('Échec de la connexion.'));
      })
    );
  }


  /**
   * Login to the backend API
   * @param loginData Objet contenant email et mot de passe
   * @returns Observable<any>
   */
  loginToBackend(loginData: { email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(`${this.apiUrl}/login`, loginData, { headers }).pipe(
      tap((response: any) => {
        console.log('Login response from backend:', response);

        // Nettoyez les anciennes données
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // Stockez les nouvelles données
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));

          // Mettez à jour l'état utilisateur
          this.userSubject.next(response.user);
          console.log('User state updated:', response.user);
        }
      }),
      catchError((error) => this.handleError(error))
    );
  }


  /**
   * Rafraîchir le token
   * @returns Observable<any>
   */
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      console.error('No refresh token available for refresh operation.');
      return throwError(() => new Error('No refresh token available.'));
    }

    const body = new URLSearchParams();
    body.set('client_id', 'frontend-client');
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post(this.keycloakTokenUrl, body.toString(), { headers }).pipe(
      tap((response: any) => {
        console.log('Token refreshed successfully:', response);
        this.storeTokens(response.access_token, response.refresh_token); // Mettre à jour les tokens
      }),
      catchError((error) => {
        console.error('Error refreshing token:', error);
        this.logout(); // Déconnexion en cas d'erreur
        window.location.href = '/login'; // Rediriger vers la page de connexion
        return throwError(() => new Error('Token refresh failed.'));
      })
    );
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout(): void {
    this.storage.removeItem('token');
    this.storage.removeItem('refresh_token');
    this.storage.removeItem('user');
    this.userSubject.next(null);
  }

  /**
   * Stocker les tokens dans le stockage configuré
   * @param token Token d'accès
   * @param refreshToken Token de rafraîchissement
   */
  private storeTokens(token: string, refreshToken: string): void {
    if (token && refreshToken) {
      this.storage.setItem('token', token);
      this.storage.setItem('refresh_token', refreshToken);
      console.log('Tokens successfully stored:', { token, refreshToken });
    } else {
      console.error('Failed to store tokens. Token or refreshToken is missing.');
    }
  }


  /**
   * Récupérer le token d'accès
   * @returns Token ou null
   */
  getToken(): string | null {
    const token = localStorage.getItem('accessToken'); // Vérifiez que c'est "accessToken"
    if (!token) {
      console.warn('No token found in localStorage.');
    } else {
      console.log('Token retrieved from localStorage:', token);
    }
    return token;
  }



  /**
   * Récupérer le token de rafraîchissement
   * @returns Refresh token ou null
   */
  getRefreshToken(): string | null {
    return this.storage.getItem('refresh_token');
  }

  /**
   * Vérifier si un token est expiré
   * @param token Token JWT
   * @returns boolean
   */
  isTokenExpired(token: string): boolean {
    if (!token) {
      console.error('Token is missing or null.');
      return true;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Décoder le payload JWT
      const now = Math.floor(new Date().getTime() / 1000); // Temps actuel en secondes
      console.log('Token expiration time:', payload.exp, 'Current time:', now);
      return payload.exp < now; // Vérifier si le token est expiré
    } catch (error) {
      console.error('Failed to decode token:', error);
      return true;
    }
  }


  /**
   * Gérer les erreurs HTTP
   * @param error Erreur HTTP
   * @returns Observable<never>
   */
  private handleError(error: any): Observable<never> {
    console.error('HTTP Error:', error);

    if (error.status === 401) {
      alert('Unauthorized: Please login again.');
      this.logout();
      window.location.href = '/login'; // Redirige vers la page de connexion
    } else if (error.status === 403) {
      alert('Access denied: You do not have permission to perform this action.');
    } else {
      alert(`Error: ${error.error?.error || 'Unknown error'}
    Description: ${error.error?.error_description || 'No description available'}`);
    }

    return throwError(() => new Error(error.message || 'An error occurred.'));
  }



  /**
   * Récupérer les en-têtes d'authentification
   * @returns HttpHeaders
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }
  // Ajoutez-les dans votre AuthService

// Mettre à jour les informations utilisateur dans le backend
  updateUser(userData: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.put(`${this.apiUrl}/${userData.id}`, userData, { headers });
  }


// Récupérer l'utilisateur connecté
  getUser(): any | null {
    return this.userSubject.value || JSON.parse(this.storage.getItem('user') || 'null');
  }

// Définir un nouvel état utilisateur
  setUser(user: any): void {
    this.userSubject.next(user); // Met à jour le BehaviorSubject avec toutes les données
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email, // Ajoutez l'email ici
        role: user.role,
      })
    );
  }


// Rechercher un utilisateur par email
  fetchUserByEmail(email: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl}/email/${email}`, { headers }).pipe(
      tap((response) => console.log('Fetched User:', response)), // Vérifiez la réponse ici
      catchError((error) => this.handleError(error))
    );
  }


// Inscription d'un utilisateur
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  decodeToken(token: string): any | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  private scheduleTokenRefresh(): void {
    const token = this.getToken();
    if (!token) return;

    const decoded = this.decodeToken(token);
    if (decoded) {
      const expiresIn = decoded.exp * 1000 - Date.now(); // Temps restant avant expiration

      setTimeout(() => {
        this.refreshToken().subscribe({
          next: () => {
            console.log('Token successfully refreshed');
          },
          error: (err) => {
            console.error('Token refresh failed:', err);
            this.logout(); // Déconnectez l'utilisateur si le rafraîchissement échoue
          },
        });
      }, expiresIn - 60000); // Rafraîchir une minute avant expiration
    }
  }




}
