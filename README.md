
---

# Grocery Management System

A full-stack web application for managing grocery store inventory, products, units of measure (UOMs), and customer orders. The backend is built with Flask (Python) and MySQL, and the frontend is built with vanilla HTML, CSS, and JavaScript.

---

## 🚀 Features

### 📊 Dashboard
- Total number of products
- Total number of orders
- Total revenue
- Total number of Units of Measure (UOMs)
- Lists recent orders
- Shows a summary of products

### 📦 Product Management
- Add, edit, and (soft) delete products
- View all active products with UOM and price
- Search products by name

### 📐 UOM Management
- Add new UOMs (e.g., kg, ltr, pcs)
- Delete UOMs (protected from deletion if in use)

### 🛒 Order Management
- Create customer orders with multiple items
- View all orders with customer name, date, and total amount
- View detailed order item breakdown
- Delete orders
- Search by customer name

### 🔌 API Backend
- RESTful API endpoints for all CRUD operations
- Health check endpoint: `/api/health`

### 💻 User Interface
- Clean and responsive design
- Modals for data editing/creation
- Loading indicators and success/error messages

---

## 🧰 Tech Stack

### Backend:
- Python 3.x
- Flask
- Flask-CORS
- `mysql-connector-python`

### Frontend:
- HTML5
- CSS3 (with CSS Variables)
- JavaScript (Vanilla ES6+)

### Database:
- MySQL

---

## 📁 Directory Structure

```

Grocery-Management/
├── backend/
│   ├── app.py              # Main Flask application (API endpoints)
│   ├── crud.py             # Database CRUD logic
│   └── db.py               # MySQL DB connection config
├── frontend/
│   ├── index.html          # Dashboard
│   ├── products.html       # Product page
│   ├── orders.html         # Orders page
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── api.js          # API utility functions
│       ├── dashboard.js
│       ├── products.js
│       └── orders.js
├── Data_Insertion.sql      # Sample data
├── Database_Config         # DB schema creation
└── requirements.txt        # Python dependencies

````

---

## ⚙️ Prerequisites

Ensure the following are installed:
- Python 3.7+
- `pip`
- MySQL Server
- Git
- (Optional) VS Code with "Live Server" extension

---

## 🔧 Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Siddhi0030/Grocery-Management.git
cd Grocery-Management
````

---

### 2. Backend Setup

#### a. Create & Activate Virtual Environment

**macOS/Linux:**

```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```bash
python -m venv venv
.\venv\Scripts\activate
```

#### b. Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### c. Database Setup (MySQL)

Log in to MySQL:

```bash
mysql -u root -p
```

Create the database and tables:

```sql
CREATE DATABASE grocery_management;
USE grocery_management;
SOURCE /path/to/grocery-management/Database_Config;
```

Insert sample data:

```sql
USE grocery_management;
SOURCE /path/to/grocery-management/Data_Insertion.sql;
```

#### d. Configure DB Credentials

Edit `backend/db.py`:

```python
import mysql.connector

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="your_mysql_user",
        password="your_mysql_password",
        database="grocery_management"
    )
```

---

### 3. Frontend Setup

You can directly open `frontend/index.html` in your browser.

**Recommended:** Serve via local HTTP server to avoid CORS issues.

#### Option 1: VS Code Live Server

* Right-click `index.html` → **Open with Live Server**

#### Option 2: Python HTTP Server

```bash
cd frontend
python -m http.server 8080
```

Visit [http://localhost:8080](http://localhost:8080)

---

## ▶️ Running the Application

### Start the Backend (Flask API)

Activate the virtual environment and run:

```bash
cd backend
python app.py
```

API will be available at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 🔌 API Endpoints

**Base URL:** `http://127.0.0.1:5000/api`

### ✅ Health Check

```
GET /health
```

### 📐 UOMs

```
GET    /uoms
POST   /uoms
DELETE /uoms/<uom_id>
```

### 📦 Products

```
GET    /products
GET    /products/<product_id>
POST   /products
PUT    /products/<product_id>
DELETE /products/<product_id>
```

### 🛒 Orders

```
GET    /orders
GET    /orders/<order_id>
POST   /orders
DELETE /orders/<order_id>
```

Refer to `backend/app.py` for request/response formats.

---