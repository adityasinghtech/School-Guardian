# School Facility Condition Reporting & Repair Tracking Portal

A comprehensive, MERN stack web application built for schools to easily report, track, and manage infrastructure issues (e.g., broken furniture, electricity faults, water supply issues).

## 🚀 Key Features

- **Multi-Role Access**: Secure authentication for Principal/Admin, Teachers, and Parents.
- **Dynamic Issue Tracking**: Create complaints with photos, priority levels, and exact locations.
- **Automated Workflow**: Admins can assign staff, mark issues as "In Progress", and "Verify & Close" repairs.
- **Discussion Board**: A commenting system on every issue for updates and clarifications.
- **Activity Logs**: Track exactly who updated what and when.
- **Zero-Configuration Setup**: See below!

## ⚡ Zero-Configuration Local Setup (For Evaluators)

This project has been engineered to be **100% plug-and-play**. We know evaluators and developers hate setting up `.env` files and configuring databases just to test a project.

**You do NOT need to configure MongoDB or Cloudinary to run this app.**

- **In-Memory Database**: If no `MONGO_URI` is provided, the backend automatically spins up an isolated `mongodb-memory-server` in the background. It creates a temporary database just for your session.
- **Local Image Fallback**: If no `CLOUDINARY_URL` is provided, the image upload system automatically switches to local disk storage and serves images statically.

### How to Run Locally

1. **Start the Backend**
   ```bash
   cd server
   npm install
   npm start
   ```
   *(Wait a few seconds for the In-Memory Database to download/start on the first run)*

2. **Start the Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Open the App**
   Navigate to `http://localhost:5173` in your browser. 
   - Click **Register School** to create a fresh school and Admin account.
   - Use the generated *School Code* to register as a Teacher or Parent and start reporting issues!

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TypeScript, Tailwind CSS, React Query, React Hook Form, Zod (Validation), Lucide React (Icons).
- **Backend**: Node.js, Express 5.x, MongoDB, Mongoose, Multer, JSON Web Tokens (JWT).
- **Architecture**: MVC Pattern (Controllers, Services, Models, Routes).

## 📝 Going to Production (Optional)

If you want to deploy this app to production or persist your data permanently:
1. Create a `.env` file in the `server` directory.
2. Add your MongoDB connection string: `MONGO_URI=mongodb+srv://...`
3. Add your Cloudinary URL for image hosting: `CLOUDINARY_URL=cloudinary://...`
4. The system will detect these and automatically switch off the virtual environment!
