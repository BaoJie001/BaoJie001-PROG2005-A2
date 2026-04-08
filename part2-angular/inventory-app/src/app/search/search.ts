// ============================================
// Author: Jie Bao
// Student ID: 24831941
// Assignment: PROG2005 Assessment 2 - Part 2
// File: search.ts
// Description: Search page component - search items by name with category and stock status filters
// ============================================

import { Component } from '@angular/core';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  stockStatus: string;
  popular: boolean;
  comment?: string;
}

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  inventory: InventoryItem[] = [];
  filteredItems: InventoryItem[] = [];
  
  searchTerm: string = '';
  filterCategory: string = '';
  filterStockStatus: string = '';
  
  message: string = '';
  messageType: string = '';

  categories: string[] = ['Electronics', 'Furniture', 'Clothing', 'Tools', 'Miscellaneous'];
  stockStatuses: string[] = ['In Stock', 'Low Stock', 'Out of Stock'];

  constructor() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.inventory = [
      { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, price: 999.99, supplier: 'TechSupply', stockStatus: 'In Stock', popular: true, comment: 'High demand' },
      { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 5, price: 149.99, supplier: 'OfficeMart', stockStatus: 'Low Stock', popular: false },
      { id: 3, name: 'T-Shirt', category: 'Clothing', quantity: 0, price: 19.99, supplier: 'FashionHub', stockStatus: 'Out of Stock', popular: false, comment: 'Seasonal item' },
      { id: 4, name: 'Smartphone', category: 'Electronics', quantity: 15, price: 699.99, supplier: 'TechSupply', stockStatus: 'In Stock', popular: true },
      { id: 5, name: 'Office Desk', category: 'Furniture', quantity: 3, price: 299.99, supplier: 'OfficeMart', stockStatus: 'Low Stock', popular: false }
    ];
    this.filteredItems = [...this.inventory];
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  performSearch() {
    let results = [...this.inventory];
    
    // Filter by search term (name)
    if (this.searchTerm.trim()) {
      results = results.filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (this.filterCategory) {
      results = results.filter(item => item.category === this.filterCategory);
    }
    
    // Filter by stock status
    if (this.filterStockStatus) {
      results = results.filter(item => item.stockStatus === this.filterStockStatus);
    }
    
    this.filteredItems = results;
    
    if (results.length === 0) {
      this.showMessage('No items found matching your criteria', 'error');
    } else {
      this.showMessage(`Found ${results.length} item(s)`, 'success');
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterCategory = '';
    this.filterStockStatus = '';
    this.filteredItems = [...this.inventory];
    this.showMessage('All filters cleared', 'success');
  }
}