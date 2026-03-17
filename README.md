# 🚀 AWS Serverless Auth Service (Multi-Marketplace)

Production-ready authentication service built with **AWS Cognito, Lambda, API Gateway, and CDK**.

This project is part of a scalable **multi-vendor marketplace backend architecture**.

---

## 🔥 Features

- ✅ User Signup (Cognito)
- ✅ Email Confirmation
- ✅ Resend Confirmation Code
- ✅ User Signin (JWT Auth)
- ✅ Access Token verification (`/me`)
- ✅ Refresh Token flow
- ✅ Logout (token invalidation strategy)
- ✅ Forgot Password
- ✅ Confirm Forgot Password
- ✅ Change Password (authorized users)

---

## 🏗️ Architecture

- **AWS Cognito** → User authentication  
- **AWS Lambda** → Business logic  
- **API Gateway** → REST API  
- **AWS CDK** → Infrastructure as Code  
- **JWT (Access + Refresh Tokens)** → Secure auth  

---

## 📂 Project Structure
lib/
├── lambda/
│ └── auth/
│ ├── signup.ts
│ ├── signin.ts
│ ├── me.ts
│ ├── refresh-token.ts
│ ├── logout.ts
│ ├── forgot-password.ts
│ ├── confirm-forgot-password.ts
│ ├── change-password.ts
│ ├── confirm-signup.ts
│ └── resend-confirmation-code.ts
│
└── users-stack.ts


---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|--------|-------------|
| POST | `/signup` | Register user |
| POST | `/confirm-signup` | Confirm email |
| POST | `/resend-confirmation-code` | Resend code |
| POST | `/signin` | Login |
| GET  | `/me` | Get current user |
| POST | `/refresh-token` | Refresh access token |
| POST | `/logout` | Logout |
| POST | `/forgot-password` | Request reset |
| POST | `/confirm-forgot-password` | Confirm reset |
| POST | `/change-password` | Change password |

---

## 🔐 Authentication Flow

1. User signs up → receives email code  
2. Confirms account  
3. Signs in → receives:
   - Access Token (short-lived)
   - Refresh Token (long-lived)  
4. Uses Access Token for protected APIs  
5. Uses Refresh Token to get new Access Token  

---

## 🧪 Testing (Thunder Client / Postman)

Example request:

```http
GET /me
Authorization: Bearer <ACCESS_TOKEN>

Deployment
npm install
cdk deploy


Key Highlights

Fully serverless architecture
 Secure JWT authentication
 Production-ready auth flows
 Scalable marketplace backend foundation

 Author

Kairat Tulegenov

Backend Developer (Node.js + AWS)
Building scalable marketplace systems


Next Steps

Multi-vendor product service

Order service (SQS, Event-driven)

Payment integration

Admin panel