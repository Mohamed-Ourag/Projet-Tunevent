import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AuthInterceptor } from './services/auth.interceptor';

// Material UI Modules
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';

// Custom Components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainBannerComponent } from './components/main-banner/main-banner.component';
import { AmazingVenuesComponent } from './components/amazing-venues/amazing-venues.component';
import { RentVenueComponent } from './pages/rent-venue/rent-venue.component';
import { ShowsEventsComponent } from './pages/shows-events/shows-events.component';
import { TicketDetailsComponent } from './pages/ticket-details/ticket-details.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { AboutComponent } from './pages/about/about.component';
import { LoginComponent } from './pages/login/login.component';
import { OrganisateurComponent } from './pages/organisateur/organisateur.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { EventTableComponent } from './event-table/event-table.component';
import { DesignTemplateComponent } from './design-template/design-template.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { DrawerComponent } from './drawer/drawer.component';
import { SummaryComponent } from './summary/summary.component';
import { EventDetailsDetailsComponent } from './event-details-details/event-details-details.component';
import { MyAccountComponent } from './components/my-account/my-account.component';
import { MyEventsComponent } from './my-events/my-events.component';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KeycloakAngularModule} from 'keycloak-angular';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainBannerComponent,
    AmazingVenuesComponent,
    RentVenueComponent,
    ShowsEventsComponent,
    TicketDetailsComponent,
    TicketsComponent,
    AboutComponent,
    LoginComponent,
    OrganisateurComponent,
    EventManagementComponent,
    EventTableComponent,
    DesignTemplateComponent,
    EventDetailsComponent,
    DrawerComponent,
    SummaryComponent,
    EventDetailsDetailsComponent,
    MyAccountComponent,
    MyEventsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatSidenavModule,
    MatSelectModule,
    CarouselModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    KeycloakAngularModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
