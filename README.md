# 🚀 Multi-Vendor Marketplace Backend (AWS Serverless)

This project is a scalable backend system built using AWS Serverless architecture.  
It demonstrates how modern cloud-based backend systems are designed, deployed, and managed in production.

---

## 🧠 Tech Stack

- AWS Lambda (Node.js 20.x)
- API Gateway (REST API)
- DynamoDB (NoSQL Database)
- AWS CDK (Infrastructure as Code)
- TypeScript

---

## ⚙️ Features

### 👤 User Service (Auth)
- Sign Up
- Confirm Sign Up
- Sign In
- Refresh Token
- Forgot Password
- Change Password
- Get Current User (Me)

### 📦 Product Service
- Create Product → `POST /products`
- Get Products → `GET /products`

---

## 🏗 Architecture
Client (Flutter / Web)
↓
API Gateway
↓
AWS Lambda (Business Logic)
↓
DynamoDB (Database)


- Fully serverless (no servers to manage)
- Scalable by default
- Pay-as-you-go pricing

---

## 🚀 Deployment

Project is deployed using AWS CDK:


cdk deploy --all
After deployment, API endpoints are generated automatically.

🔗 Example API Endpoints
POST   /products      → Create product
GET    /products      → Get all products


📂 Project Structure
bin/
  multi-market-place.ts   # CDK entry point

lib/
  users-stack.ts          # Auth service
  product-stack.ts        # Product service
  lambda/
    product/
      product-create.ts
      get-products.ts


🧪 Example Request
Create Product
{
  "title": "T-shirt",
  "description": "jaz kiimi",
  "price": 3000
}

🎯 What I Learned

Building real-world backend using AWS

Designing serverless architecture

Using Infrastructure as Code (CDK)

Working with DynamoDB (NoSQL)

Creating production-style REST APIs


🚀 Next Steps

Order Service

Payment Integration (Stripe)

Vendor System (Multi-vendor logic)

Image Upload (S3)

👨‍💻 Author

Kairat Tulegenov

⭐️ Notes

This project is part of my journey to becoming a Full Stack AWS Engineer.
