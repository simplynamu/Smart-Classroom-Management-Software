# SMART CLASSROOM MANAGEMENT SOFTWARE

### A web-based solution to streamline school operations, organize classrooms, manage users, and facilitate seamless communication.  
Track attendance, assess performance, visualize data, and communicate — all in one platform.

---

## 🚀 About the Project

**Smart Classroom Management Software** is a full-stack web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It aims to digitize and simplify the management of school operations for **Admins**, **Teachers**, and **Students**.

---

## ✨ Features

- **Role-Based Access:**
  - **Admin:** Manage students, teachers, classes, subjects, and system settings.
  - **Teacher:** Take attendance, assess students, provide feedback, and communicate.
  - **Student:** View attendance, performance reports, and messages.

- **Attendance Tracking:**  
  Teachers can mark students as present or absent and generate attendance reports.

- **Performance Evaluation:**  
  Teachers can assign marks and feedback. Students can view progress over time.

- **Data Visualization:**  
  Performance data is presented using interactive charts and tables.

- **Built-in Communication:**  
  Messaging system for direct communication between teachers and students.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Material UI, Redux  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB

---

## ⚙️ Installation & Setup

### Step 1: Clone the Repository

```sh
git clone https://github.com/Yogndrr/MERN-School-Management-System.git
```

### Step 2: Backend Setup

```sh
cd backend
npm install
npm start
```

Create a `.env` file inside the `backend` folder and add:

```env
MONGO_URL = mongodb://127.0.0.1/school
```

> 🔍 Replace with your own MongoDB URI if using MongoDB Atlas.

### Step 3: Frontend Setup

Open a new terminal:

```sh
cd frontend
npm install
npm start
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000

---

## 🧩 Resolving Signup Errors

If you encounter **network errors** or **endless loading** during signup:

### Step 1: Update Frontend Environment

1. Go to `frontend/.env`  
2. Uncomment the first line (if commented out)
3. Restart the frontend:

```sh
cd frontend
npm start
```

### Step 2: Update API Base URL in Code

1. Open:  
   `frontend/src/redux/userRelated/userHandle.js`

2. Add after imports:

```js
const REACT_APP_BASE_URL = "http://localhost:5000";
```

3. Replace all instances of:

```js
process.env.REACT_APP_BASE_URL
```

with:

```js
REACT_APP_BASE_URL
```

4. Repeat this process in all files containing `"Handle"` in the filename, such as:
   - `teacherHandle.js`
   - `adminHandle.js`
   - Any `View` files that use a `deleteHandler` function

---

## 🔐 Signup & Login Notes

- Start by **signing up** if you haven’t created an account.
- For **guest login**, open `LoginPage.js` and use existing credentials from the system (email and password).

---

## ⭐ Support

If this project helped you, **please consider leaving a star ⭐**  
Still facing issues? **Feel free to contact me** for assistance!
