import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakInitService } from './app/services/keycloak-init.service';

// Fonction d'initialisation de Keycloak
function initializeKeycloak(keycloakInitService: KeycloakInitService): () => Promise<boolean> {
  return () => keycloakInitService.initKeycloak();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch((err) => console.error(err));
