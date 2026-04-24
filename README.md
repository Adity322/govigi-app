# 🛒 GoVigi Retail Portal

A full-stack application for ordering fruits and vegetables in bulk. The platform allows users to browse products, place orders, and track them seamlessly across web and mobile interfaces.

---

## 🚀 Live Links

* 🌐 Frontend: https://govigi-app.vercel.app
* 🔗 Backend API: https://govigi-app-1.onrender.com
* 🎥 Demo Video: https://drive.google.com/file/d/15GekX1hT0d3-c3f4RSLj52OLDDWPpCln/view?usp=share_link

---

## 📌 Features

### 🔐 Authentication

* User registration and login
* Secure JWT-based authentication
* Protected routes for authorized access

### 🥦 Product Management

* View fruits and vegetables
* Categorized product listing
* Data fetched dynamically from backend API

### 📦 Order System

* Place orders
* View order history
* Order status tracking (Pending → Confirmed → Delivered)

### 📱 Multi-platform Support

* Web application (Next.js)
* Mobile application (React Native / Expo)

---

## 🛠️ Tech Stack

### Frontend (Web)

* Next.js
* Tailwind CSS

### Mobile App

* React Native (Expo)

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 📂 Project Structure

```
govigi-app/
│
├── backend/        # Express backend (APIs, DB, Auth)
├── web/            # Next.js frontend
├── mobile/         # React Native mobile app
```

---

## ⚙️ Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=https://govigi-app-1.onrender.com
```

---

### Backend (.env)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=8000
```

---

## 🧪 Running Locally

### 1. Clone Repository

```
git clone https://github.com/your-username/govigi-app.git
cd govigi-app
```

---

### 2. Run Backend

```
cd backend
npm install
node src/seed.js   # Seed sample products
node server.js     # or: npm start
npm start
```

---

### 3. Run Frontend

```
cd web
npm install
npm run dev
```

---

### 4. Run Mobile App

```
cd mobile
npm install
# Update your Mac's IP in mobile/lib/axios.js before running
# Find IP with: ipconfig getifaddr en0
npx expo start
```

---

## 🔗 API Endpoints

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login user
* `GET /api/products` → Get all products
* `POST /api/orders` → Place an order
* `GET /api/orders` → Get user orders
* PUT /api/orders/:id  → Update order status

---

## ⚠️ Notes

* Backend is hosted on Render (may take a few seconds to wake up)
* Ensure environment variables are configured properly
* CORS is enabled for frontend-backend communication

---

## 📈 Future Improvements

* Payment integration (Razorpay / Stripe)
* Admin dashboard
* Real-time order tracking
* UI/UX enhancements

---

## 👨‍💻 Author

Aditya Singh

---

## 📜 License

This project is for educational purposes.
