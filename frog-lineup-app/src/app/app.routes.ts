import { Routes } from '@angular/router';
import { MobileLayoutComponent } from './mobile-layout/mobile-layout.component';
import { MobileLineupComponent } from './mobile-layout/lineup.component';
import { StatsComponent } from './mobile-layout/stats.component';
import { MobileInfoComponent } from './mobile-layout/info.component';

export const routes: Routes = [
  {
    path: 'mobile',
    component: MobileLayoutComponent,
    children: [
      { path: '', redirectTo: 'lineup', pathMatch: 'full' },
      { path: 'lineup', component: MobileLineupComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'info', component: MobileInfoComponent },
    ],
  },
  { path: '', redirectTo: '/mobile/lineup', pathMatch: 'full' },
];
