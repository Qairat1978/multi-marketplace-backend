# 🚀 Multi-Vendor Marketplace Backend (AWS Serverless)

A scalable **multi-vendor marketplace backend** built using AWS Serverless architecture.

This project demonstrates how modern cloud-based backend systems are designed, deployed, and managed in production.

---

# 🧠 Tech Stack

* AWS Lambda (Node.js)
* API Gateway (REST API)
* DynamoDB (NoSQL Database)
* Amazon S3 (Image Storage)
* AWS CDK (Infrastructure as Code)
* TypeScript

---

# ⚙️ Features

## 👤 User Service (Auth)

* Sign Up
* Confirm Sign Up
* Sign In
* Refresh Token
* Forgot Password
* Change Password
* Get Current User (Me)

---

## 📦 Product Service

* Create Product → `POST /products`
* Get Products → `GET /products`
* Filter by category
* Filter by vendor
* Pagination support

---

## 🖼 Image Upload (S3)

* Pre-signed URL upload
* Direct upload from client → S3
* No backend file processing (high performance)

---

## 📢 Ads Service

* Upload banner images
* Create ads
* Fetch ads for homepage

---

# 🏗 Architecture

![Image](https://images.openai.com/static-rsc-4/ePR7HAoBwL4-K3p3XFbZQfqGihu7F3Fm0PnHmS52tkwqZthLmUWpyWedSldUrYCqCbDzCzDSMXG-P7cEABS2THIcfdC_4z4u_oBZ9xsucODIDMRmkIVOlx3lFYMC3OJBf8EiB_f0HvoeFbKj-bTR4OJrs9xze8HU3GKknrWxCdFA4kKdTc2bXiYWmrjlsvuK?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/vsqW_4o6fpkouqQaiKrdjtMNAYZrHfVQeiKKDN6kwu5tI45E1SMIoxCnBVJtZrcA9T3faqzCgn6LWZDMuEwa5cqme2n1nkQpz7qhT1kQhz_4u65LaU47ROdkttZatY7sIKv6EIl3haKoqPCbFzKbzu05fS9UalU_q9BtAOft9ktGEQcdB7mfgvExNTeyXSVJ?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/9F-ZohuI-jUvALA0Me85qamPqdOubkp24UFIN79CW4W-gsqAznFX-NcuvdADRZCoSbHFm_jue-uSghzShU_OHHGxCL467WMjrWufxUweF-9jNqfvNlcehXZBAeYOq_FoRQNI-Rc8iAQhWH9iuXzETOw2pzP99OoJKzdtu-81YhSe3uUaIKMLNjMxoP6kpYBj?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/nje3ReniMm2Xp0ooGv_kt8c_G53MwPEIW0DjtV5GOZfvG-KSnh9NQtS2MPpC0OrT0vy0cM1HZ-fxPBt4GJKHqmE1ZxgOPDBhYsMD9euJy-GTq-zsbeHwh3u2zj9FoSHOhcNKjnASs08V7d0UbJylMmNETTh1wdmmyZSj6cIUy7X2N4ULRqCVNWe-YwRQphoi?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/Iwxi0Ley--WndVFHR4IKtDiQBbVWH_oZ7sH_LiIoZiz6y8aqMNAfzRw199MqI7mueg5KS7ikGwD05Lz6ORui4Sd5RxgjOnSRBu5IzQLAGYo9ARAomLgXgQbYco6GlvN8bcoj9Se5b8H-BiYtruSIjhs5KHR6flGbbStZyMUS5bOgVbD1w33rnzcibZwD2OMB?purpose=fullsize)

![Image](https://images.openai.com/static-rsc-4/k_eibfkPLIWwpPqKy5ALRt8niNq-pTeHSvPvTyd08I8c9Dvsys8M81nOeKlqvJeyJdzFgLwRY0sJvdUAiDQbCYbvZwz645P4UFRv3wpjGBUM_7SvjonXNRffOydjSWQS2bvTSsvTIRvpLxb_KkVV58ehXgpbVIy8B9A24dJvvw1v5ihkZk1YprCrYRxVSlia?purpose=fullsize)

### Flow

Client (Flutter / Web)
↓
API Gateway
↓
AWS Lambda (Business Logic)
↓
DynamoDB (Data Storage)
↘
S3 (Image Upload via Signed URL)

---

# 🚀 Deployment

Project is deployed using AWS CDK:

```bash
cdk deploy --all
```

After deployment, API endpoints are generated automatically.

---

# 🔗 API Endpoints

## Product APIs

```bash
POST   /products
GET    /products
```

## Upload API

```bash
POST   /upload-url
```

---

# 🔄 Example Flow

### 1. Get Upload URL

```json
POST /upload-url
{
  "fileName": "image.jpg",
  "fileType": "image/jpeg",
  "vendorId": "vendor1"
}
```

---

### 2. Upload to S3

```bash
PUT uploadUrl
```

---

### 3. Create Product

```json
POST /products
{
  "productName": "T-shirt",
  "description": "Summer wear",
  "price": 3000,
  "image": "products/vendor1/uuid.jpg",
  "vendorId": "vendor1"
}
```

---

### 4. Fetch Products

```bash
GET /products
```

---

# 📊 DynamoDB Design

## Table: Products

| Field       | Type   |
| ----------- | ------ |
| id          | PK     |
| productName | string |
| category    | string |
| vendorId    | string |
| createdAt   | string |

---

## Indexes (GSI)

| Index          | Purpose            |
| -------------- | ------------------ |
| category-index | filter by category |
| vendorId-index | filter by vendor   |

---

# 📂 Project Structure

```bash
bin/
  multi-market-place.ts

lib/
  users-stack.ts
  product-stack.ts
  ads-stack.ts

  lambda/
    product/
      product-create.ts
      get-products.ts
      get-upload-url.ts

    ads/
      get-upload-url.ts
```

---

# 🧪 Example Request

```json
{
  "productName": "T-shirt",
  "description": "jaz kiimi",
  "price": 3000
}
```

---

# 🎯 What I Learned

* Building real-world backend using AWS
* Designing scalable serverless architecture
* Using Infrastructure as Code (CDK)
* Working with DynamoDB (NoSQL)
* Implementing S3 file upload with signed URLs
* Creating production-ready REST APIs

---

# 🚀 Next Steps

* Order Service
* Payment Integration (Stripe)
* Vendor Dashboard (Multi-vendor system)
* Authentication (AWS Cognito)
* CloudFront CDN for images

---

# 👨‍💻 Author

**Kairat Tulegenov**

---

# ⭐ Notes

This project is part of my journey to becoming a **Full Stack AWS Engineer**.
