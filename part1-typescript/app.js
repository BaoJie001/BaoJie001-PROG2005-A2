"use strict";
// ============================================
// Author: BaoJie001
// Assignment: PROG2005 Assignment 2 - Part 1
// Description: TypeScript Inventory Management System
// ============================================
// Global inventory array
let inventory = [];
// ============================================
// Custom Confirmation Dialog (replaces confirm())
// ============================================
function showCustomConfirm(message, onConfirm) {
    // Create overlay div
    const overlay = document.createElement("div");
    overlay.id = "customConfirmOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "1000";
    // Create dialog box
    const dialog = document.createElement("div");
    dialog.style.backgroundColor = "white";
    dialog.style.padding = "20px";
    dialog.style.borderRadius = "12px";
    dialog.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
    dialog.style.maxWidth = "400px";
    dialog.style.width = "90%";
    dialog.style.textAlign = "center";
    // Message
    const msg = document.createElement("p");
    msg.textContent = message;
    msg.style.margin = "0 0 20px 0";
    msg.style.fontSize = "16px";
    msg.style.color = "#333";
    // Button container
    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "10px";
    btnContainer.style.justifyContent = "center";
    // Confirm button
    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.style.backgroundColor = "#dc3545";
    confirmBtn.style.color = "white";
    confirmBtn.style.border = "none";
    confirmBtn.style.padding = "10px 20px";
    confirmBtn.style.borderRadius = "6px";
    confirmBtn.style.cursor = "pointer";
    confirmBtn.style.fontSize = "14px";
    // Cancel button
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.backgroundColor = "#6c757d";
    cancelBtn.style.color = "white";
    cancelBtn.style.border = "none";
    cancelBtn.style.padding = "10px 20px";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.cursor = "pointer";
    cancelBtn.style.fontSize = "14px";
    // Confirm action
    confirmBtn.onclick = () => {
        document.body.removeChild(overlay);
        onConfirm();
    };
    // Cancel action
    cancelBtn.onclick = () => {
        document.body.removeChild(overlay);
    };
    // Close when clicking outside
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    };
    btnContainer.appendChild(confirmBtn);
    btnContainer.appendChild(cancelBtn);
    dialog.appendChild(msg);
    dialog.appendChild(btnContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}
// ============================================
// Helper Functions
// ============================================
function generateNewId() {
    if (inventory.length === 0)
        return 1;
    const maxId = Math.max(...inventory.map(item => item.id));
    return maxId + 1;
}
function validateItem(item) {
    if (!item.name || item.name.trim() === "")
        return "Item Name is required";
    if (!item.category)
        return "Category is required";
    if (item.quantity === undefined || item.quantity < 0)
        return "Quantity must be a positive number";
    if (item.price === undefined || item.price < 0)
        return "Price must be a positive number";
    if (!item.supplier || item.supplier.trim() === "")
        return "Supplier Name is required";
    if (!item.stockStatus)
        return "Stock Status is required";
    if (item.popular === undefined)
        return "Popular status is required";
    return null;
}
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
        if (m === "&")
            return "&amp;";
        if (m === "<")
            return "&lt;";
        if (m === ">")
            return "&gt;";
        return m;
    });
}
function renderInventory(items) {
    const container = document.getElementById("inventoryList");
    if (!container)
        return;
    if (items.length === 0) {
        container.innerHTML = "<p>No items found.</p>";
        return;
    }
    let html = "";
    for (const item of items) {
        html += `
            <div class="item-card">
                <h3>${escapeHtml(item.name)}</h3>
                <p><strong>ID:</strong> ${item.id}</p>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Quantity:</strong> ${item.quantity}</p>
                <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                <p><strong>Supplier:</strong> ${escapeHtml(item.supplier)}</p>
                <p><strong>Stock Status:</strong> ${item.stockStatus}</p>
                <p><strong>Popular Item:</strong> ${item.popular ? "Yes" : "No"}</p>
                ${item.comment ? `<p><strong>Comment:</strong> ${escapeHtml(item.comment)}</p>` : ""}
            </div>
        `;
    }
    container.innerHTML = html;
}
function displayAllItems() {
    renderInventory(inventory);
}
function displayPopularItems() {
    const popularItems = inventory.filter(item => item.popular === true);
    renderInventory(popularItems);
}
function addItem() {
    const id = generateNewId();
    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("category").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);
    const supplier = document.getElementById("supplier").value.trim();
    const stockStatus = document.getElementById("stockStatus").value;
    const popularValue = document.getElementById("popular").value;
    const popular = popularValue === "Yes";
    const comment = document.getElementById("comment").value.trim() || undefined;
    if (inventory.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        showMessage("Error: Item with this name already exists. Use Update to modify.", "error");
        return false;
    }
    const newItem = {
        id, name, category,
        quantity: isNaN(quantity) ? 0 : quantity,
        price: isNaN(price) ? 0 : price,
        supplier, stockStatus, popular, comment
    };
    const validationError = validateItem(newItem);
    if (validationError) {
        showMessage(`Validation Error: ${validationError}`, "error");
        return false;
    }
    inventory.push(newItem);
    clearForm();
    displayAllItems();
    showMessage(`Item "${name}" added successfully!`, "success");
    return true;
}
// Delete item by name with CUSTOM confirmation (no confirm())
function deleteItemByName() {
    const name = document.getElementById("searchName").value.trim();
    if (!name) {
        showMessage("Please enter an item name to delete", "error");
        return;
    }
    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) {
        showMessage(`Item "${name}" not found`, "error");
        return;
    }
    // Use custom confirm instead of native confirm()
    showCustomConfirm(`Are you sure you want to delete "${item.name}"?`, () => {
        inventory = inventory.filter(i => i.id !== item.id);
        displayAllItems();
        clearForm();
        showMessage(`Item "${name}" deleted successfully!`, "success");
    });
}
function searchItemByName() {
    const name = document.getElementById("searchName").value.trim();
    if (!name) {
        showMessage("Please enter an item name to search", "error");
        return;
    }
    const foundItems = inventory.filter(item => item.name.toLowerCase().includes(name.toLowerCase()));
    if (foundItems.length === 0) {
        renderInventory([]);
        showMessage(`No items found matching "${name}"`, "error");
    }
    else {
        renderInventory(foundItems);
        showMessage(`Found ${foundItems.length} item(s) matching "${name}"`, "success");
    }
}
function updateItemByName() {
    const name = document.getElementById("itemName").value.trim();
    if (!name) {
        showMessage("Please enter the item name to update", "error");
        return;
    }
    const existingItem = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!existingItem) {
        showMessage(`Item "${name}" not found`, "error");
        return;
    }
    const category = document.getElementById("category").value;
    const quantity = parseInt(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);
    const supplier = document.getElementById("supplier").value.trim();
    const stockStatus = document.getElementById("stockStatus").value;
    const popularValue = document.getElementById("popular").value;
    const popular = popularValue === "Yes";
    const comment = document.getElementById("comment").value.trim() || undefined;
    const updatedItem = {
        ...existingItem,
        category: category || existingItem.category,
        quantity: isNaN(quantity) ? existingItem.quantity : quantity,
        price: isNaN(price) ? existingItem.price : price,
        supplier: supplier || existingItem.supplier,
        stockStatus: stockStatus || existingItem.stockStatus,
        popular,
        comment
    };
    const validationError = validateItem(updatedItem);
    if (validationError) {
        showMessage(`Validation Error: ${validationError}`, "error");
        return;
    }
    const index = inventory.findIndex(i => i.id === existingItem.id);
    inventory[index] = updatedItem;
    clearForm();
    displayAllItems();
    showMessage(`Item "${name}" updated successfully!`, "success");
}
function clearForm() {
    document.getElementById("itemId").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("category").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("price").value = "";
    document.getElementById("supplier").value = "";
    document.getElementById("stockStatus").value = "In Stock";
    document.getElementById("popular").value = "No";
    document.getElementById("comment").value = "";
    document.getElementById("searchName").value = "";
}
function showMessage(msg, type) {
    const container = document.getElementById("inventoryList");
    if (!container)
        return;
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.style.padding = "10px";
    messageDiv.style.margin = "10px 0";
    messageDiv.style.borderRadius = "6px";
    messageDiv.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
    messageDiv.style.color = type === "success" ? "#155724" : "#721c24";
    messageDiv.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
    messageDiv.innerText = msg;
    if (container.firstChild) {
        container.insertBefore(messageDiv, container.firstChild);
    }
    else {
        container.appendChild(messageDiv);
    }
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}
// Initialize
document.addEventListener("DOMContentLoaded", () => {
    const sampleItems = [
        { id: 1, name: "Laptop", category: "Electronics", quantity: 10, price: 999.99, supplier: "TechSupply", stockStatus: "In Stock", popular: true, comment: "High demand" },
        { id: 2, name: "Desk Chair", category: "Furniture", quantity: 5, price: 149.99, supplier: "OfficeMart", stockStatus: "Low Stock", popular: false, comment: "" },
        { id: 3, name: "T-Shirt", category: "Clothing", quantity: 0, price: 19.99, supplier: "FashionHub", stockStatus: "Out of Stock", popular: false, comment: "Seasonal item" }
    ];
    inventory = sampleItems;
    displayAllItems();
    document.getElementById("addBtn")?.addEventListener("click", addItem);
    document.getElementById("updateBtn")?.addEventListener("click", updateItemByName);
    document.getElementById("deleteBtn")?.addEventListener("click", deleteItemByName);
    document.getElementById("searchBtn")?.addEventListener("click", searchItemByName);
    document.getElementById("showAllBtn")?.addEventListener("click", displayAllItems);
    document.getElementById("showPopularBtn")?.addEventListener("click", displayPopularItems);
});
