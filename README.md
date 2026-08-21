# 🌍 Wanderlust — Full-Stack Travel & Accommodation Platform

Wanderlust is a full-stack web application inspired by Airbnb, designed to allow users to discover, list, and review unique accommodations across the globe. Built using the MVC (Model-View-Controller) architecture, it offers full CRUD capabilities, user authentication, interactive map integrations, and secure image storage.

---

## ✨ Features

* **Property Management (CRUD):** Users can create, view, edit, and delete their own accommodation listings.
* **Review & Rating System:** Guests can leave star ratings and comments on listings, with authorization locks ensuring only review authors can delete their feedback.
* **Authentication & Authorization:** 
  * Secure User Registration and Login via Passport.js.
  * Role-based permissions preventing unauthorized users from editing or deleting listings/reviews created by others.
* **Cloud Image Uploads:** Seamless media uploads powered by Cloudinary and Multer.
* **Input Validation & Security:**
  * Schema validation using Joi.
  * Session-based authentication, flash messages, and defensive error handling middleware.

---

## 🛠️ Tech Stack

### **Backend**
* **Node.js & Express.js:** Server runtime and MVC web framework.
* **MongoDB & Mongoose:** NoSQL database and object data modeling (ODM).
* **Passport.js:** Authentication middleware handling local strategy sessions.

### **Frontend & Templating**
* **EJS (Embedded JavaScript) / React:** Dynamic UI rendering and component layouts.
* **Bootstrap 5 / Custom CSS:** Responsive design, custom cards, and interactive forms.

### **Third-Party Services**
* **Cloudinary:** Cloud storage for property images.


---
