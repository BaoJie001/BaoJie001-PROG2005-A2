// ============================================
// Author: Jie Bao
// Student ID: 24831941
// Assignment: PROG2005 Assessment 2 - Part 2
// File: app.ts
// Description: Root component of Angular application with navigation menu
// ============================================

import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('inventory-app');
}
