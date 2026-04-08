// ============================================
// Author: Jie Bao
// Student ID: 24831941
// Assignment: PROG2005 Assessment 2 - Part 2
// File: app-module.ts
// Description: Main module that declares all components and imports required modules
// ============================================

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './home/home';
import { Inventory } from './inventory/inventory';
import { Search } from './search/search';
import { Privacy } from './privacy/privacy';
import { HelpPage } from './help-page/help-page';

@NgModule({
  declarations: [
    App,
    Home,
    Inventory,
    Search,
    Privacy,
    HelpPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }