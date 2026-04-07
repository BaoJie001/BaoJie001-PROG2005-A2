import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Inventory } from './inventory/inventory';
import { Search } from './search/search';
import { Privacy } from './privacy/privacy';
import { HelpPage } from './help-page/help-page';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'home', component: Home },
  { path: 'inventory', component: Inventory },
  { path: 'search', component: Search },
  { path: 'privacy', component: Privacy },
  { path: 'help', component: HelpPage },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }