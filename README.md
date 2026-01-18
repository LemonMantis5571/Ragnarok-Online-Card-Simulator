# ⚔️ Ragnarok Card Album Simulator

A premium, high-performance card collection simulator inspired by the classic world of Ragnarok Online. Build your collection, hunt for ultra-rare MVP cards, and enjoy a state-of-the-art fantasy UI.



## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Vanilla CSS Design System
- **Icons**: [Lucide React](https://lucide.dev/)
- **Interactivity**: Custom 3D Tilt & Holographic Shader Logic

### **Backend**
- **Language**: [Go](https://go.dev/)
- **API Framework**: [Chi Router](https://github.com/go-chi/chi)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Cloud-compatible)
- **Middleware**: [httprate](https://github.com/go-chi/httprate) (Rate Limiting)

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js**: v18+
- **Go**: v1.21+
- **PostgreSQL**: A cloud instance (e.g., CockroachDB, Supabase, Neon) or local server.

### **1. Setup Environment**
Create a `.env` file in the **backend** directory:
```env
SERVER_HOST=0.0.0.0
PORT=8089
DATABASE_URL=your_postgresql_dsn_here
ENV=development
```

Create a `.env` file in the **frontend** directory:
```env
VITE_API_URL=http://localhost:8089/api
```

### **2. Run the Backend**
```bash
cd backend
go run cmd/api/main.go
```

### **3. Run the Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment

This project is designed to be hosted on any cloud platform supporting Go and React.

### **Backend Requirements**
- Set the `DATABASE_URL` environment variable.
- The server listens on `$PORT` and `0.0.0.0` by default.

### **Frontend Requirements**
- Build the project using `npm run build`.
- Serve the static files from the `dist` folder.
- Ensure `VITE_API_URL` points to your deployed backend URL.

---



## 📜 License
This project is for educational and simulation purposes. Ragnarok Online assets and themes are trademarks of Gravity Co., Ltd.
