// ============================================
// Author: Jie Bao
// Student ID: 24831941
// Assignment: PROG2005 Assessment 2 - Part 2
// File: app-routing-module.ts
// Description: Routing configuration for 5 pages: Home, Inventory, Search, Privacy, Help
// ============================================

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