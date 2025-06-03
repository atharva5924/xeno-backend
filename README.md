# 🧠 Mini CRM Platform – Frontend (Client)

This is the **frontend React application** for the **Mini CRM Platform** built for the Xeno SDE Internship Assignment – 2025. It enables users to create audience segments, launch personalized marketing campaigns, and gain intelligent insights, all via a clean and dynamic user interface.

## 🌐 Live Demo

> 🔗 [Deployed Frontend Link](https://your-frontend.vercel.app)

## 📽️ Demo Video

> 🔗 [Watch the Demo (YouTube)](https://your-demo-link)

---

## ✨ Features

- 🔐 **Google OAuth2.0 Authentication** (via `@react-oauth/google`)
- 🧱 **Dynamic Segment Rule Builder** with AND/OR conditions
- 🔍 **Audience Preview** based on applied filters
- 📈 **Campaign History** with delivery stats (sent, failed, audience size)
- 📬 **Trigger Campaigns** with mock vendor API simulation
- 🧠 **AI-Powered Message Suggestions** for campaign messages
- 🧩 Drag & Drop UI elements using `react-dnd`
- 💬 Toast messages, confirmations, and validations via Ant Design

---

## 🛠️ Tech Stack

| Category     | Tech Used                          |
|--------------|------------------------------------|
| Language     | JavaScript (ESNext), JSX           |
| Framework    | [React 19](https://react.dev/)     |
| UI Library   | [Ant Design](https://ant.design/)  |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com/) |
| State/Data   | [React Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) |
| Auth         | [Google OAuth](https://www.npmjs.com/package/@react-oauth/google) |
| Parsing      | [PapaParse](https://www.papaparse.com/) |
| Drag & Drop  | [react-dnd](https://react-dnd.github.io/) |
| HTTP Client  | [Axios](https://axios-http.com/)   |
| Routing      | [React Router DOM v7](https://reactrouter.com/) |
| Bundler      | [Vite](https://vitejs.dev/)        |

---

## 🧪 AI Feature Implemented

### ✨ AI-Driven Message Suggestions

On campaign creation, users can generate multiple variants of personalized messages based on campaign objectives like:

- 💤 "Bring back inactive users"
- 💸 "Reward high-spending customers"

> AI Tool Used: [OpenAI GPT API](https://platform.openai.com/)

---

## 🏗️ Frontend Architecture Overview

```text
Frontend (React.js + Tailwind + Ant Design)
│
├── Google OAuth Login (React Context + Token Handling)
│   ├── Uses @react-oauth/google for authentication
│   ├── Stores token in context and persists user session
│   └── Restricts access to protected routes
│
├── Segment Builder (Rules Engine + Dynamic Form UI)
│   ├── Users create audience segments using flexible AND/OR logic
│   ├── UI supports nested logical conditions and validation
│   └── Uses react-hook-form for controlled form management
│
├── Campaign Manager (Delivery Triggers + API Logging)
│   ├── Triggers new campaigns via backend after segment save
│   ├── Logs sent/failed messages into communication_log
│   └── Handles optimistic UI feedback for delivery status
│
├── AI Assistant (Prompt Input → Message Suggestions)
│   ├── Integrates with OpenAI API to generate campaign messages
│   ├── Accepts plain text objectives and returns 2–3 variants
│   └── Allows user to select one to proceed with
│
└── Campaign History Dashboard (Paginated + Stats View)
    ├── Fetches and displays campaign logs from backend
    ├── Shows sent, failed counts and delivery receipts
    └── Sorted by most recent campaigns at the top
```


Backend, pub-sub, and AI APIs are handled via a separate Node.js service.

---

## 🚀 Local Setup Instructions

1. **Clone the Repo**

```bash
git clone https://github.com/your-username/xeno-crm.git
cd xeno-crm/client
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a .env file in the root of client:-

# Google OAuth Client ID for authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id
# Base URL for backend API endpoints
VITE_API_BASE_URL=http://localhost:5000


4. **Run the Dev Server**

```bash
npm run dev
```

---

## 📬 Feedback

Have suggestions or found a bug?  
Feel free to [create an issue](https://github.com/atharva5924/xeno-crm/issues) or [fork the repository](https://github.com/atharva5924/xeno-crm/fork) and submit a pull request.  
We appreciate all forms of contributions!

---

## 📄 License

This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for more details.

---

> Made with ❤️ for the **Xeno SDE Internship Assignment – 2025**


