# MERN E-Commerce Backend

This is the backend API for the MERN E-Commerce application. It provides endpoints for user authentication, product management, cart operations, and image handling. Built with Express.js and MongoDB.

## Features

- **User Authentication**: Sign up and login using JWT.
- **Product Management**: Add, remove, and fetch products.
- **Shopping Cart**: Add/remove items and retrieve cart functionality.
- **Image Upload**: Cloudinary integration for persistent image storage.
- **Deployment Ready**: Configured for Vercel serverless deployment.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Token (JWT)
- **File Storage**: Cloudinary (via Multer)
- **CORS**: Enabled for cross-origin requests

## Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/ReavanthKumar/MERN-E-Commerce-Backend.git
    cd MERN-E-Commerce-Backend/e-commerce-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=4000
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    BASE_URL=http://localhost:4000
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the application**
    ```bash
    npm start
    ```
    The server will start on port 4000 (or the port specified in .env).

## API Endpoints

### Authentication

| Method | Endpoint  | Description                | Body Parameters |
| :----- | :-------- | :------------------------- | :-------------- |
| POST   | `/signup` | Register a new user        | `username`, `email`, `password` |
| POST   | `/login`  | Login existing user        | `email`, `password` |

### Products

| Method | Endpoint           | Description                      | Body Parameters |
| :----- | :----------------- | :------------------------------- | :-------------- |
| GET    | `/allproducts`     | Get all products                 | - |
| GET    | `/newcollections`  | Get latest products              | - |
| GET    | `/popularinwomen`  | Get popular women's products     | - |
| POST   | `/addproduct`      | Add a new product                | `name`, `image`, `category`, `new_price`, `old_price` |
| POST   | `/removeproduct`   | Remove a product                 | `id`, `name` |

### Cart (Requires Auth Token)

Requests must include `auth-token` header.

| Method | Endpoint          | Description           | Body Parameters |
| :----- | :---------------- | :-------------------- | :-------------- |
| POST   | `/addtocart`      | Add item to user cart | `itemId` |
| POST   | `/removefromcart` | Remove item from cart | `itemId` |
| POST   | `/getcart`        | Get current user cart | - |

### Uploads

| Method | Endpoint  | Description    | Body Parameters |
| :----- | :-------- | :------------- | :-------------- |
| POST   | `/upload` | Upload image   | `product` (Form Data) |

## Deployment on Vercel

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the **Environment Variables** (MONGO_URL, JWT_SECRET, Cloudinary credentials) in the Vercel dashboard.
4.  Deploy.

## Folder Structure

- `index.js`: Main entry point and route definitions.
- `upload/`: (Deprecated) Local storage folder.
- `package.json`: Dependencies and scripts.

## License

ISC
