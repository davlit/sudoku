import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }  from './home/home.component';
import { PlayComponent }  from './play/play.component';
import { HelpComponent }  from './help/help.component';
import { PrintComponent }  from './print/print.component';

const routes: Routes = [
  { path: '', redirectTo: '/play', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'play', component: PlayComponent },
  { path: 'help', component: HelpComponent },
  { path: 'print', component: PrintComponent }
];

/**
 * The routing module is explained in 
 * https://angular.io/docs/ts/latest/guide/router.html
 */
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
