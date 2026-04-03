// ============================================
// Author: BaoJie001
// Assignment: PROG2005 Assignment 2 - Part 1
// Description: TypeScript Inventory Management System
// ============================================

// Define the Inventory Item interface
interface InventoryItem {
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

// Global inventory array
let inventory: InventoryItem[] = [];

// Helper: Generate a new unique ID
function generateNewId(): number {
    if (inventory.length === 0) return 1;
    const maxId = Math.max(...inventory.map(item => item.id));
    return maxId + 1;
}

// Helper: Validate required fields
function validateItem(item: Partial<InventoryItem>): string | null {
    if (!item.name || item.name.trim() === "") return "Item Name is required";
    if (!item.category) return "Category is required";
    if (item.quantity === undefined || item.quantity < 0) return "Quantity must be a positive number";
    if (item.price === undefined || item.price < 0) return "Price must be a positive number";
    if (!item.supplier || item.supplier.trim() === "") return "Supplier Name is required";
    if (!item.stockStatus) return "Stock Status is required";
    if (item.popular === undefined) return "Popular status is required";
    return null;
}

// Helper: Render inventory to HTML
function renderInventory(items: InventoryItem[]): void {
    const container = document.getElementById("inventoryList");
    if (!container) return;

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

// Simple escape function to prevent XSS
function escapeHtml(str: string): string {
    return str.replace(/[&<>]/g, function(m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
    });
}

// Display all items
function displayAllItems(): void {
    renderInventory(inventory);
}

// Display only popular items (popular === true)
function displayPopularItems(): void {
    const popularItems = inventory.filter(item => item.popular === true);
    renderInventory(popularItems);
}

// Add a new item
function addItem(): boolean {
    // Get form values
    const id = generateNewId();
    const name = (document.getElementById("itemName") as HTMLInputElement).value.trim();
    const category = (document.getElementById("category") as HTMLSelectElement).value;
    const quantity = parseInt((document.getElementById("quantity") as HTMLInputElement).value);
    const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
    const supplier = (document.getElementById("supplier") as HTMLInputElement).value.trim();
    const stockStatus = (document.getElementById("stockStatus") as HTMLSelectElement).value;
    const popularValue = (document.getElementById("popular") as HTMLSelectElement).value;
    const popular = popularValue === "Yes";
    const comment = (document.getElementById("comment") as HTMLInputElement).value.trim() || undefined;

    // Check for duplicate ID (should not happen with generateNewId, but just in case)
    if (inventory.some(item => item.id === id)) {
        showMessage("Error: Duplicate ID detected", "error");
        return false;
    }

    // Check for duplicate name
    if (inventory.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        showMessage("Error: Item with this name already exists. Use Update to modify.", "error");
        return false;
    }

    // Create new item
    const newItem: InventoryItem = {
        id,
        name,
        category,
        quantity: isNaN(quantity) ? 0 : quantity,
        price: isNaN(price) ? 0 : price,
        supplier,
        stockStatus,
        popular,
        comment
    };

    // Validate
    const validationError = validateItem(newItem);
    if (validationError) {
        showMessage(`Validation Error: ${validationError}`, "error");
        return false;
    }

    // Add to inventory
    inventory.push(newItem);
    clearForm();
    displayAllItems();
    showMessage(`Item "${name}" added successfully!`, "success");
    return true;
}

// Delete item by name (with confirmation)
function deleteItemByName(): void {
    const name = (document.getElementById("searchName") as HTMLInputElement).value.trim();
    if (!name) {
        showMessage("Please enter an item name to delete", "error");
        return;
    }

    const item = inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (!item) {
        showMessage(`Item "${name}" not found`, "error");
        return;
    }

    const confirmDelete = confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmDelete) {
        inventory = inventory.filter(i => i.id !== item.id);
        displayAllItems();
        clearForm();
        showMessage(`Item "${name}" deleted successfully!`, "success");
    }
}

// Search item by name and display
function searchItemByName(): void {
    const name = (document.getElementById("searchName") as HTMLInputElement).value.trim();
    if (!name) {
        showMessage("Please enter an item name to search", "error");
        return;
    }

    const foundItems = inventory.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase())
    );

    if (foundItems.length === 0) {
        renderInventory([]);
        showMessage(`No items found matching "${name}"`, "error");
    } else {
        renderInventory(foundItems);
        showMessage(`Found ${foundItems.length} item(s) matching "${name}"`, "success");
    }
}

// Update item by name
function updateItemByName(): void {
    const name = (document.getElementById("itemName") as HTMLInputElement).value.trim();
    if (!name) {
        showMessage("Please enter the item name to update", "error");
        return;
    }

    const existingItem = inventory.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (!existingItem) {
        showMessage(`Item "${name}" not found`, "error");
        return;
    }

    // Get updated values from form
    const category = (document.getElementById("category") as HTMLSelectElement).value;
    const quantity = parseInt((document.getElementById("quantity") as HTMLInputElement).value);
    const price = parseFloat((document.getElementById("price") as HTMLInputElement).value);
    const supplier = (document.getElementById("supplier") as HTMLInputElement).value.trim();
    const stockStatus = (document.getElementById("stockStatus") as HTMLSelectElement).value;
    const popularValue = (document.getElementById("popular") as HTMLSelectElement).value;
    const popular = popularValue === "Yes";
    const comment = (document.getElementById("comment") as HTMLInputElement).value.trim() || undefined;

    // Build updated item (keep ID and name unchanged)
    const updatedItem: InventoryItem = {
        ...existingItem,
        category: category || existingItem.category,
        quantity: isNaN(quantity) ? existingItem.quantity : quantity,
        price: isNaN(price) ? existingItem.price : price,
        supplier: supplier || existingItem.supplier,
        stockStatus: stockStatus || existingItem.stockStatus,
        popular,
        comment
    };

    // Validate
    const validationError = validateItem(updatedItem);
    if (validationError) {
        showMessage(`Validation Error: ${validationError}`, "error");
        return;
    }

    // Update in array
    const index = inventory.findIndex(i => i.id === existingItem.id);
    inventory[index] = updatedItem;

    clearForm();
    displayAllItems();
    showMessage(`Item "${name}" updated successfully!`, "success");
}

// Clear form inputs
function clearForm(): void {
    (document.getElementById("itemId") as HTMLInputElement).value = "";
    (document.getElementById("itemName") as HTMLInputElement).value = "";
    (document.getElementById("category") as HTMLSelectElement).value = "";
    (document.getElementById("quantity") as HTMLInputElement).value = "";
    (document.getElementById("price") as HTMLInputElement).value = "";
    (document.getElementById("supplier") as HTMLInputElement).value = "";
    (document.getElementById("stockStatus") as HTMLSelectElement).value = "In Stock";
    (document.getElementById("popular") as HTMLSelectElement).value = "No";
    (document.getElementById("comment") as HTMLInputElement).value = "";
    (document.getElementById("searchName") as HTMLInputElement).value = "";
}

// Show temporary message (using innerHTML instead of alert)
function showMessage(msg: string, type: "success" | "error"): void {
    const container = document.getElementById("inventoryList");
    if (!container) return;

    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}`;
    messageDiv.style.padding = "10px";
    messageDiv.style.margin = "10px 0";
    messageDiv.style.borderRadius = "6px";
    messageDiv.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
    messageDiv.style.color = type === "success" ? "#155724" : "#721c24";
    messageDiv.style.border = `1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"}`;
    messageDiv.innerText = msg;

    // Insert at top of container
    if (container.firstChild) {
        container.insertBefore(messageDiv, container.firstChild);
    } else {
        container.appendChild(messageDiv);
    }

    // Remove after 3 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 3000);
}

// Initialize: Add some sample data and bind events
document.addEventListener("DOMContentLoaded", () => {
    // Sample data for testing
    const sampleItems: InventoryItem[] = [
        { id: 1, name: "Laptop", category: "Electronics", quantity: 10, price: 999.99, supplier: "TechSupply", stockStatus: "In Stock", popular: true, comment: "High demand" },
        { id: 2, name: "Desk Chair", category: "Furniture", quantity: 5, price: 149.99, supplier: "OfficeMart", stockStatus: "Low Stock", popular: false, comment: "" },
        { id: 3, name: "T-Shirt", category: "Clothing", quantity: 0, price: 19.99, supplier: "FashionHub", stockStatus: "Out of Stock", popular: false, comment: "Seasonal item" }
    ];
    inventory = sampleItems;
    displayAllItems();

    // Bind button events
    document.getElementById("addBtn")?.addEventListener("click", addItem);
    document.getElementById("updateBtn")?.addEventListener("click", updateItemByName);
    document.getElementById("deleteBtn")?.addEventListener("click", deleteItemByName);
    document.getElementById("searchBtn")?.addEventListener("click", searchItemByName);
    document.getElementById("showAllBtn")?.addEventListener("click", displayAllItems);
    document.getElementById("showPopularBtn")?.addEventListener("click", displayPopularItems);
});