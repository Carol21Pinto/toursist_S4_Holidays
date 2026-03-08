![S4 Holidays Logo](frontend/src/assets/logo.png)

# Toursist S4 Holidays

This repository contains a full-stack travel booking application built with a Node.js/Express backend and a React/Vite frontend. It's designed to manage travel packages, authentication, and admin functionality, while providing a responsive user interface for customers.

## 🚀 Features

### Backend
- RESTful API using **Express.js**
- MongoDB models with **Mongoose**
- Admin authentication with JWT
- Package CRUD operations
- Rate limiting middleware
- Image uploads handled via Cloudinary
- Email service for OTP and notifications
- Utilities for file handling and validation

### Frontend
- React application initialized with **Vite**
- Component-driven architecture
- Responsive layout with modern CSS
- Pages for home, package listings, details, and admin panel
- Admin routes protected with JWT
- Image preview and upload features
- Client-side caching with `fetchWithCache` utility

## 📁 Repository Structure

```
├── backend/                # Express server and API logic
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, rate limiter, etc.
│   ├── models/             # MongoDB schemas
│   ├── routes/             # Express routers
│   ├── services/           # Email, file uploads
│   ├── utils/              # Helper functions
│   ├── uploads/            # Local storage for development
│   ├── app.js              # Entry point
│   └── package.json        # Backend dependencies

├── frontend/               # React/Vite client
│   ├── public/             # Static assets
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Route pages
│   │   └── utils/          # Client utilities
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js
│   └── README.md           # Frontend-specific info

└── package.json            # Workspace scripts (if applicable)
```

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) v16+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MongoDB connection string
- Cloudinary account (for image uploads)

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<cloudinary-api-key>
   CLOUDINARY_API_SECRET=<cloudinary-api-secret>
   ```
4. Run the server:
   ```bash
   npm start
   # or
   npm run dev # if using nodemon
   ```

### Frontend
1. Move into the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file or configure environment variables (e.g. `VITE_API_BASE_URL`):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open http://localhost:3000 (or the port shown by Vite) in your browser.

## 📦 Deployment

- Backend can be deployed to platforms like Heroku, Vercel (Serverless functions), or DigitalOcean.
- Frontend is ready for static hosting and can be deployed to Vercel, Netlify, or GitHub Pages.
- Ensure environment variables are set in your hosting environment.

## 🔗 Links

- Website (frontend): https://s4holidays.com/
- Backend API: hosted on [Vercel](https://vercel.com/)
- Frontend: hosted on GoDaddy

## 🧩 Scripts

Both frontend and backend have their own `package.json` scripts. From the root you can also add workspace-based commands if using npm workspaces.

Example backend scripts:
```json
"start": "node app.js",
"dev": "nodemon app.js"
```

Example frontend scripts:
```json
"dev": "vite",
"build": "vite build",
"preview": "vite preview"
```

## 📝 Usage

### Admin
- Use the admin login page to sign in with credentials stored in the database.
- Manage packages: add, edit, delete.
- View dashboard stats and user interactions.

### Public
- Browse travel packages by category, state, or continent.
- View package details and images.
- Contact support or make inquiries (if such features exist).

## 📚 Code Notes
- The backend configuration for Cloudinary is in `backend/config/cloudinary.js`.
- The email service uses nodemailer for OTPs and notifications.
- Rate limiting is implemented using `express-rate-limit` in `middleware/rateLimiter.js`.
- Frontend routing uses React Router DOM and protected routes for admin.

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request.

Please follow the current coding conventions and ensure your code is linted.

## 🛡️ License
This project is **not open-source**. All rights are reserved by the development team. Do not redistribute or use the code without explicit permission.

## � Team
This project was developed by the following team members:

- Rahul M ([GitHub](https://github.com/RahulMGatty))
- Carol Pinto ([GitHub](https://github.com/Carol21Pinto))
- Rashmitha Maria Dsouza ([GitHub](https://github.com/RashmithaDsouza))
- Ashith Joswa Fernandes ([GitHub](https://github.com/spideyashith/spideyashith))

## �📄 Acknowledgements
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Cloudinary](https://cloudinary.com/)
- [MongoDB](https://www.mongodb.com/)
- Any other libraries or resources you used.

---
---
> “Travel and education together create the most enriching experiences; every journey is a lesson for the student inside us.”

