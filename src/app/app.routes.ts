import { Routes } from '@angular/router';
import { Home } from './component/home/home';
import { AboutUs } from './component/about-us/about-us';
import { Plans } from './component/plans/plans';
import { PlanDetails } from './component/plan-details/plan-details';
import { Booking } from './component/booking/booking';
import { Success } from './component/success/success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: AboutUs },
  { path: 'plans', component: Plans },
  { path: 'plan-details/:id', component:PlanDetails },
  { path: 'booking', component: Booking },
  { path: 'success', component: Success },
  { path: '**', redirectTo: '' }
];
