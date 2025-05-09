
---

# Grocery Store Management Web Application

This project is a Grocery Store Management Web App developed using the 3-tier architecture:

* **Frontend**: Built using HTML, CSS, JavaScript, and Bootstrap
* **Backend**: Developed with Python and Flask
* **Database**: MySQL

![Homepage](homepage.JPG)

---

## 📦 Getting Started

To get started, ensure you have MySQL installed. You can download it here:
🔗 [MySQL Installer for Windows](https://dev.mysql.com/downloads/installer/)

Install the required Python package:

```bash
pip install mysql-connector-python
```

---

## ✅ Feature Enhancement Tasks

After initial deployment, user feedback revealed several usability issues and missing features. The following tasks aim to improve the overall user experience and functionality:

### 🛒 Products Module

1. **Edit Existing Product**
   On the product listing page, include an “Edit” button next to each product’s “Delete” button. This will allow users to update product details directly.

2. **Add New UOM (Unit of Measurement)**
   Introduce functionality for users to define and add new units of measurement (e.g., *Cubic Meter* for new inventory items like wood). This will involve both:

   * Backend changes to support dynamic UOMs
   * Frontend form updates to facilitate entry

---

### 📦 Orders Module

3. **Form Input Validation**
   Improve the robustness of the order creation page by enforcing validation rules such as:

   * Customer name must not be empty
   * Item name must be valid
   * Quantity should be non-zero and numeric

4. **Dynamic Total Calculation Fix**
   Currently, manually editing an item’s total price does not refresh the overall total. Ensure the grand total updates correctly with any item-level changes.

5. **Order Detail View**
   In the orders list, append a “View” button to each entry. Clicking this should open a detailed view displaying:

   * List of items in the order
   * Their quantities
   * Individual and total prices

---

## 💻 Technologies Used

* **Frontend**: HTML5, CSS3, Bootstrap, JavaScript
* **Backend**: Python (Flask framework)
* **Database**: MySQL
* **Connector**: `mysql-connector-python`

---