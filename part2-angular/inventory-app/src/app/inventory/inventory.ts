// ============================================
// Author: Jie Bao
// Student ID: 24831941
// Assignment: PROG2005 Assessment 2 - Part 2
// File: inventory.ts
// Description: Inventory management component - add, edit, delete, display all, display popular items
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
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory {
  // Full inventory list (original data)
  fullInventory: InventoryItem[] = [];
  
  // Displayed inventory list (can be filtered)
  inventory: InventoryItem[] = [];
  
  // Form fields
  itemName: string = '';
  category: string = '';
  quantity: number = 0;
  price: number = 0;
  supplier: string = '';
  stockStatus: string = 'In Stock';
  popular: boolean = false;
  comment: string = '';
  
  // Search field
  searchName: string = '';
  
  // Message
  message: string = '';
  messageType: string = '';
  
  // Custom confirmation dialog
  showConfirmDialog: boolean = false;
  confirmMessage: string = '';
  confirmCallback: (() => void) | null = null;

  constructor() {
    this.loadSampleData();
  }

  loadSampleData() {
    this.fullInventory = [
      { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, price: 999.99, supplier: 'TechSupply', stockStatus: 'In Stock', popular: true, comment: 'High demand' },
      { id: 2, name: 'Desk Chair', category: 'Furniture', quantity: 5, price: 149.99, supplier: 'OfficeMart', stockStatus: 'Low Stock', popular: false },
      { id: 3, name: 'T-Shirt', category: 'Clothing', quantity: 0, price: 19.99, supplier: 'FashionHub', stockStatus: 'Out of Stock', popular: false, comment: 'Seasonal item' }
    ];
    this.inventory = [...this.fullInventory];
  }

  generateNewId(): number {
    if (this.fullInventory.length === 0) return 1;
    const maxId = Math.max(...this.fullInventory.map(item => item.id));
    return maxId + 1;
  }

  showMessage(msg: string, type: string) {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  clearForm() {
    this.itemName = '';
    this.category = '';
    this.quantity = 0;
    this.price = 0;
    this.supplier = '';
    this.stockStatus = 'In Stock';
    this.popular = false;
    this.comment = '';
    this.searchName = '';
  }

  addItem() {
    if (!this.itemName.trim()) {
      this.showMessage('Item Name is required', 'error');
      return;
    }
    if (!this.category) {
      this.showMessage('Category is required', 'error');
      return;
    }
    if (this.quantity < 0) {
      this.showMessage('Quantity must be positive', 'error');
      return;
    }
    if (this.price < 0) {
      this.showMessage('Price must be positive', 'error');
      return;
    }
    if (!this.supplier.trim()) {
      this.showMessage('Supplier Name is required', 'error');
      return;
    }

    if (this.fullInventory.some(item => item.name.toLowerCase() === this.itemName.toLowerCase())) {
      this.showMessage('Item with this name already exists', 'error');
      return;
    }

    const newItem: InventoryItem = {
      id: this.generateNewId(),
      name: this.itemName.trim(),
      category: this.category,
      quantity: this.quantity,
      price: this.price,
      supplier: this.supplier.trim(),
      stockStatus: this.stockStatus,
      popular: this.popular,
      comment: this.comment.trim() || undefined
    };

    this.fullInventory.push(newItem);
    this.inventory = [...this.fullInventory];
    this.clearForm();
    this.showMessage(`Item "${newItem.name}" added successfully!`, 'success');
  }

  updateItem() {
    if (!this.itemName.trim()) {
      this.showMessage('Enter item name to update', 'error');
      return;
    }

    const existingItem = this.fullInventory.find(item => 
      item.name.toLowerCase() === this.itemName.toLowerCase()
    );

    if (!existingItem) {
      this.showMessage(`Item "${this.itemName}" not found`, 'error');
      return;
    }

    existingItem.category = this.category || existingItem.category;
    existingItem.quantity = this.quantity >= 0 ? this.quantity : existingItem.quantity;
    existingItem.price = this.price >= 0 ? this.price : existingItem.price;
    existingItem.supplier = this.supplier.trim() || existingItem.supplier;
    existingItem.stockStatus = this.stockStatus || existingItem.stockStatus;
    existingItem.popular = this.popular;
    existingItem.comment = this.comment.trim() || undefined;

    this.inventory = [...this.fullInventory];
    this.clearForm();
    this.showMessage(`Item "${existingItem.name}" updated successfully!`, 'success');
  }

  // Custom confirmation dialog (replaces confirm())
  openConfirmDialog(message: string, callback: () => void) {
    this.confirmMessage = message;
    this.confirmCallback = callback;
    this.showConfirmDialog = true;
  }

  closeConfirmDialog(confirmed: boolean) {
    this.showConfirmDialog = false;
    if (confirmed && this.confirmCallback) {
      this.confirmCallback();
    }
    this.confirmCallback = null;
  }

  deleteItem() {
    if (!this.searchName.trim()) {
      this.showMessage('Enter item name to delete', 'error');
      return;
    }

    const item = this.fullInventory.find(i => 
      i.name.toLowerCase() === this.searchName.toLowerCase()
    );

    if (!item) {
      this.showMessage(`Item "${this.searchName}" not found`, 'error');
      return;
    }

    // Use custom confirmation dialog instead of confirm()
    this.openConfirmDialog(`Are you sure you want to delete "${item.name}"?`, () => {
      this.fullInventory = this.fullInventory.filter(i => i.id !== item.id);
      this.inventory = [...this.fullInventory];
      this.clearForm();
      this.showMessage(`Item "${item.name}" deleted successfully!`, 'success');
    });
  }

  searchItem() {
    if (!this.searchName.trim()) {
      this.showMessage('Enter item name to search', 'error');
      return;
    }

    const found = this.fullInventory.filter(item =>
      item.name.toLowerCase().includes(this.searchName.toLowerCase())
    );

    if (found.length === 0) {
      this.showMessage(`No items found matching "${this.searchName}"`, 'error');
    } else {
      this.inventory = found;
      this.showMessage(`Found ${found.length} item(s)`, 'success');
    }
  }

  displayAllItems() {
    this.inventory = [...this.fullInventory];
    this.showMessage('Showing all items', 'success');
  }

  displayPopularItems() {
    const popularItems = this.fullInventory.filter(item => item.popular === true);
    this.inventory = [...popularItems];
    
    if (popularItems.length === 0) {
      this.showMessage('No popular items found', 'error');
    } else {
      this.showMessage(`Showing ${popularItems.length} popular item(s)`, 'success');
    }
  }
}