# Personal Finance Tracker - API Testing Guide

This document contains sample `curl` commands to test all newly created endpoints. You can also import these concepts into Thunder Client or Postman.

> **Note:** For all protected endpoints, replace `<YOUR_JWT_TOKEN>` with the token received from the Login or Register response.

---

### 1. Authentication

**Register User**
```bash
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"SecurePass1!"}'
```

**Login User**
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"SecurePass1!"}'
```

---

### 2. Categories

**Create a Category**
```bash
curl -X POST http://localhost:5001/api/v1/categories \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Groceries","type":"EXPENSE"}'
```

**Get All Categories**
```bash
curl -X GET http://localhost:5001/api/v1/categories \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Delete a Category**
```bash
# Note: Deleting a category will reassign its transactions to the default "Uncategorized" category.
curl -X DELETE http://localhost:5001/api/v1/categories/<CATEGORY_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 3. Transactions

**Create a Transaction**
```bash
curl -X POST http://localhost:5001/api/v1/transactions \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50.25,
    "type": "EXPENSE",
    "categoryId": "<CATEGORY_ID>",
    "date": "2026-05-01",
    "description": "Weekly groceries"
  }'
```

**Get Transactions (with pagination & filters)**
```bash
curl -X GET "http://localhost:5001/api/v1/transactions?page=1&limit=10&type=EXPENSE" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

**Update a Transaction**
```bash
curl -X PUT http://localhost:5001/api/v1/transactions/<TRANSACTION_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 55.00}'
```

**Delete a Transaction**
```bash
curl -X DELETE http://localhost:5001/api/v1/transactions/<TRANSACTION_ID> \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 4. Budgets

**Set/Update a Budget for a Category**
```bash
curl -X POST http://localhost:5001/api/v1/budgets \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "<CATEGORY_ID>",
    "month": 5,
    "year": 2026,
    "amount": 500.00
  }'
```

**Get Budgets (for a specific month)**
```bash
curl -X GET "http://localhost:5001/api/v1/budgets?month=5&year=2026" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### 5. Reports

**Get Summary & Breakdown Report**
```bash
curl -X GET http://localhost:5001/api/v1/reports \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```
