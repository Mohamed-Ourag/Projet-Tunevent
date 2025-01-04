import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainBannerComponent} from './components/main-banner/main-banner.component';
import {AmazingVenuesComponent} from './components/amazing-venues/amazing-venues.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {TicketsComponent} from './pages/tickets/tickets.component';
import {RentVenueComponent} from './pages/rent-venue/rent-venue.component';
import {ShowsEventsComponent} from './pages/shows-events/shows-events.component';
import {TicketDetailsComponent} from './pages/ticket-details/ticket-details.component';
import {AboutComponent} from './pages/about/about.component';
import {LoginComponent} from './pages/login/login.component';
import {OrganisateurComponent} from './pages/organisateur/organisateur.component';
import {DesignTemplateComponent} from './design-template/design-template.component';
import {DrawerComponent} from './drawer/drawer.component';
import {EventDetailsDetailsComponent} from './event-details-details/event-details-details.component';
import {MyAccountComponent} from './components/my-account/my-account.component';
import {MyEventsComponent} from './my-events/my-events.component';

const routes: Routes = [
  {path:"" ,component:DrawerComponent ,pathMatch: 'full'},
  {path:"login" ,component:DrawerComponent},
  {path:"home" ,component:MainBannerComponent},
  {path:"amazing" ,component:AmazingVenuesComponent},
  {path:"footer" ,component:FooterComponent},
  {path:"header" ,component:HeaderComponent},
  {path:"rent-venue" ,component:RentVenueComponent},
  {path:"shows-events" ,component:ShowsEventsComponent},
  {path:"tickets" ,component:TicketsComponent},
  {path:"about" ,component:AboutComponent},
  {path:"ticketdetails" ,component:TicketDetailsComponent},
  {path:"organisateur" ,component:OrganisateurComponent},
  {path:"design-template" ,component:DesignTemplateComponent},
  { path: 'event-details/:id', component: EventDetailsDetailsComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'my-events', component: MyEventsComponent },








];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
