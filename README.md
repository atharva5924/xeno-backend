# 🧠 Mini CRM Platform – Backend (Server)

This is the **backend service** for the Mini CRM Platform built for the **Xeno SDE Internship Assignment – 2025**. It powers REST APIs for data ingestion, segmentation, campaign delivery, and AI integration, optionally using a pub-sub architecture for scalability.

---

## 🔗 Related Repositories

- 📦 **Frontend Repo:** [Mini CRM Frontend (React)](https://github.com/atharva5924/xeno-frontend)

---

## 🧩 Features

- 🔐 Google OAuth2 token verification
- 📥 Secure APIs for customer and order ingestion
- 🧠 Segment rule parsing with AND/OR logic
- 📬 Campaign generation & vendor simulation (~90% success)
- 📨 Delivery receipt tracking with async logging
- 🧵 Optional Redis/Kafka/RabbitMQ pub-sub integration
- 🤖 AI-powered message suggestions (OpenAI)

---

## 🛠️ Tech Stack

| Category         | Tech Used                        |
|------------------|----------------------------------|
| Language         | JavaScript (Node.js)             |
| Framework        | Express.js                       |
| Database         | MongoDB + Mongoose               |
| Auth             | Google OAuth2                    |
| AI Integration   | OpenAI GPT API                   |
| Pub/Sub (optional) | Redis Streams / Kafka / RabbitMQ |
| Dev Tools        | dotenv, axios, cors, nodemon     |

---

## 📦 API Routes

### 🔐 Authentication

| Method | Route                | Description                          |
|--------|----------------------|--------------------------------------|
| POST   | `/api/auth/google`   | Verifies Google OAuth token          |

### 📥 Data Ingestion

| Method | Route               | Description                      |
|--------|---------------------|----------------------------------|
| POST   | `/api/customers`    | Ingest customer data             |
| POST   | `/api/orders`       | Ingest order data                |

### 🧠 Segments & Campaigns

| Method | Route                 | Description                                |
|--------|-----------------------|--------------------------------------------|
| POST   | `/api/segments`       | Create new audience segment + campaign     |
| GET    | `/api/campaigns`      | Get all past campaigns                     |
| GET    | `/api/campaigns/:id`  | Get campaign details by ID                 |

### 📬 Campaign Delivery & Logging

| Method | Route               | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/send`         | Simulate vendor sending messages     |
| POST   | `/api/receipt`      | Vendor delivery receipt callback     |

### 🤖 AI Integration

| Method | Route                    | Description                                 |
|--------|--------------------------|---------------------------------------------|
| POST   | `/api/ai/messages`       | Generate message suggestions (OpenAI)       |
| POST   | `/api/ai/summary`        | Generate campaign performance summary       |

> 🔐 All routes require authentication via Google OAuth Bearer token.

---

## 🧾 Environment Setup

1. **Clone the repo and install dependencies**

```bash
git clone https://github.com/your-username/xeno-crm-backend.git
cd server
npm install
```

2. **🧾 Environment Setup**

### 📄 Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongo_uri
GOOGLE_CLIENT_ID=your_google_client_id
OPENAI_API_KEY=your_openai_api_key
USE_PUBSUB=true
REDIS_URL=redis://localhost:6379
```

3. **🚀 Run the Server**

```bash
npm run dev
```


# 📌 Known Limitations
- OpenAI integration assumes internet availability.
- Pub/sub is toggleable and not auto-scaled.
- No retry mechanism on failed vendor deliveries.
- Auth assumes valid Google token from frontend.

---

# 📄 License
This project is licensed under the MIT License.  
See the LICENSE file for full details.

---

# 🚀 Built with ❤️  
Built for the Xeno SDE Internship Assignment – 2025
