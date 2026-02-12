# CRM System - Customer Relationship Management

A comprehensive CRM system built with Node.js, Express, and MongoDB for managing customers, subscriptions, notifications, and email marketing campaigns with secure authentication and role-based access control.

## Features

### 🔐 Authentication & Security
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin/Manager/Staff)
- **Permission system** for granular access control
- **Password hashing** with bcrypt
- **User profile management**
- **Protected API endpoints**

### 🏢 Customer Management
- Complete customer profiles with personal information
- Customer categorization (Gym/Restaurant/Other)
- Customer status tracking (Interested/Not Interested/Subscribed/Expired)
- Advanced search and filtering capabilities
- Customer statistics and analytics
- **Permission-based access** to customer data

### 📋 Subscription Management
- Flexible subscription packages (Basic/Premium/VIP/Custom)
- Payment status tracking
- Automatic renewal options
- Subscription expiry monitoring
- Revenue analytics
- **Role-based subscription management**

### 🔔 Notification System
- Automated subscription expiry reminders (5 days before)
- Payment reminder notifications
- Welcome emails for new customers
- Custom notification creation
- Multi-channel support (Email/SMS/Push)
- Delivery tracking and analytics
- **Controlled notification access**

### 📧 Email Marketing
- Campaign creation and management
- Multiple email templates (Welcome/Expiry/Payment/Promotion)
- Target audience selection
- Scheduled campaigns
- Campaign performance analytics
- Email testing functionality
- **Admin-controlled email campaigns**

## User Roles & Permissions

### 👑 Admin
- Full access to all features
- Can manage users and permissions
- Can delete any data
- All permissions: `customer_*`, `subscription_*`, `notification_*`, `email_campaign_*`, `stats_view`

### 👨‍💼 Manager
- Can create and edit most data
- Cannot delete critical data
- Cannot manage users
- Permissions: `customer_read`, `customer_write`, `subscription_read`, `subscription_write`, `notification_read`, `notification_write`, `email_campaign_read`, `email_campaign_write`, `stats_view`

### 👥 Staff
- Read-only access to most data
- Can create basic customers and subscriptions
- Limited write permissions
- Permissions: `customer_read`, `customer_write`, `subscription_read`, `notification_read`, `stats_view`

## API Endpoints

### 🔑 Authentication (`/api/auth`)
- `POST /register` - Register new user (Admin only)
- `POST /login` - User login
- `GET /profile` - Get user profile (Authenticated)
- `PUT /profile` - Update user profile (Authenticated)
- `PUT /change-password` - Change password (Authenticated)
- `POST /refresh-token` - Refresh JWT token (Authenticated)

### 🏢 Customers (`/api/customers`) - *Requires Authentication*
- `POST /` - Create new customer (`customer_write` permission)
- `GET /` - Get all customers (`customer_read` permission)
- `GET /search?q=query` - Search customers (`customer_read` permission)
- `GET /stats` - Get customer statistics (`stats_view` permission)
- `GET /category/:category` - Get customers by category (`customer_read` permission)
- `GET /status/:status` - Get customers by status (`customer_read` permission)
- `GET /:id` - Get customer by ID (`customer_read` permission)
- `PUT /:id` - Update customer (`customer_write` permission)
- `PATCH /:id/status` - Update customer status (`customer_write` permission)
- `DELETE /:id` - Delete customer (`customer_delete` permission)

### 📋 Subscriptions (`/api/subscriptions`) - *Requires Authentication*
- `POST /` - Create new subscription (`subscription_write` permission)
- `GET /` - Get all subscriptions (`subscription_read` permission)
- `GET /stats` - Get subscription statistics (`stats_view` permission)
- `GET /active` - Get active subscriptions (`subscription_read` permission)
- `GET /expiring-soon` - Get subscriptions expiring soon (`subscription_read` permission)
- `GET /expired` - Get expired subscriptions (`subscription_read` permission)
- `GET /customer/:customerId` - Get customer subscriptions (`subscription_read` permission)
- `GET /:id` - Get subscription by ID (`subscription_read` permission)
- `PUT /:id` - Update subscription (`subscription_write` permission)
- `PATCH /:id/payment-status` - Update payment status (`subscription_write` permission)
- `POST /:id/renew` - Renew subscription (`subscription_write` permission)
- `DELETE /:id` - Delete subscription (`subscription_delete` permission)

### 🔔 Notifications (`/api/notifications`) - *Requires Authentication*
- `POST /` - Create notification (`notification_write` permission)
- `GET /` - Get all notifications (`notification_read` permission)
- `GET /stats` - Get notification statistics (`stats_view` permission)
- `GET /pending` - Get pending notifications (`notification_read` permission)
- `POST /subscription-expiry` - Create expiry notifications (`notification_write` permission)
- `POST /payment-reminders` - Create payment reminders (`notification_write` permission)
- `GET /customer/:customerId` - Get customer notifications (`notification_read` permission)
- `POST /customer/:customerId/welcome` - Send welcome notification (`notification_write` permission)
- `GET /:id` - Get notification by ID (`notification_read` permission)
- `PUT /:id` - Update notification (`notification_write` permission)
- `POST /:id/send` - Send notification (`notification_write` permission)
- `DELETE /:id` - Delete notification (`notification_delete` permission)

### 📧 Email Campaigns (`/api/email-campaigns`) - *Requires Authentication*
- `POST /` - Create email campaign (`email_campaign_write` permission)
- `GET /` - Get all campaigns (`email_campaign_read` permission)
- `POST /test` - Test email sending (`email_campaign_write` permission)
- `GET /:id` - Get campaign by ID (`email_campaign_read` permission)
- `PUT /:id` - Update campaign (`email_campaign_write` permission)
- `POST /:id/launch` - Launch campaign (`email_campaign_write` permission)
- `POST /:id/schedule` - Schedule campaign (`email_campaign_write` permission)
- `POST /:id/pause` - Pause campaign (`email_campaign_write` permission)
- `POST /:id/resume` - Resume campaign (`email_campaign_write` permission)
- `GET /:id/stats` - Get campaign statistics (`stats_view` permission)
- `GET /:id/recipients` - Get target recipients (`email_campaign_read` permission)
- `DELETE /:id` - Delete campaign (`email_campaign_delete` permission)

## Postman Collections

📁 **Separate collections available for each service:**

### 🔑 Auth Collection
- File: `postman/Auth.postman_collection.json`
- Contains all authentication endpoints
- Includes login/register examples
- Variables: `baseUrl`, `authToken`

### 🏢 Customers Collection
- File: `postman/Customers.postman_collection.json`
- All customer management endpoints
- Pre-configured with authentication
- Variables: `baseUrl`, `authToken`, `customerId`

### 📋 Subscriptions Collection
- File: `postman/Subscriptions.postman_collection.json`
- Complete subscription management
- Payment status updates
- Variables: `baseUrl`, `authToken`, `subscriptionId`

### 🔔 Notifications Collection
- File: `postman/Notifications.postman_collection.json`
- Notification creation and management
- Automated notification triggers
- Variables: `baseUrl`, `authToken`, `notificationId`

### 📧 Email Campaigns Collection
- File: `postman/EmailCampaigns.postman_collection.json`
- Campaign management endpoints
- Email testing functionality
- Variables: `baseUrl`, `authToken`, `campaignId`

## Automated Tasks (Cron Jobs)

The system includes automated tasks that run on schedule:

1. **Daily at 9:00 AM** - Check for subscription expirations (5 days before)
2. **Weekly on Monday at 10:00 AM** - Send payment reminders
3. **Hourly** - Process pending notifications
4. **Daily at 8:00 AM** - Launch scheduled email campaigns

## Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables in `.env` (copy from `.env.example`):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/crm-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Email Configuration (Gmail Example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Application Settings
APP_NAME=CRM System
APP_VERSION=1.0.0

# Security Settings
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

3. Start the server:
```bash
npm run dev
# or
npm start
```

4. **Setup first admin user:**
```bash
# Use the Auth collection in Postman to register first admin
POST /api/auth/register
{
    "username": "admin",
    "email": "admin@crm.com",
    "password": "123456",
    "role": "admin"
}
```

## Usage Examples

### 🔑 Login Flow
```javascript
// 1. Login to get token
POST /api/auth/login
{
    "email": "admin@crm.com",
    "password": "123456"
}

// Response
{
    "success": true,
    "data": {
        "user": { "id": "...", "username": "admin", "role": "admin" },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}

// 2. Use token in subsequent requests
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🏢 Create a Customer (Authenticated)
```javascript
POST /api/customers
Authorization: Bearer {token}
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "category": "gym",
    "notes": "Interested in premium membership"
}
```

### 📋 Create a Subscription (Authenticated)
```javascript
POST /api/subscriptions
Authorization: Bearer {token}
{
    "customer": "customer_id",
    "packageType": "premium",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "price": 999,
    "paymentMethod": "card",
    "autoRenew": true
}
```

### 📧 Launch Email Campaign (Admin Only)
```javascript
POST /api/email-campaigns
Authorization: Bearer {admin_token}
{
    "name": "New Year Promotion",
    "subject": "Special Offer for 2024!",
    "template": "promotion",
    "content": "Dear {{name}}, get 20% off on all subscriptions!",
    "targetAudience": "interested",
    "createdBy": "admin"
}
```

## Database Schema

### User Model (New)
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: Enum ['admin', 'manager', 'staff'] (default: 'staff'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  permissions: [String] // Array of permission strings
}
```

### Customer Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  address: String,
  category: Enum ['gym', 'restaurant', 'other'] (required),
  status: Enum ['interested', 'not_interested', 'subscribed', 'expired'],
  notes: String,
  lastContactDate: Date,
  totalSpent: Number
}
```

### Subscription Model
```javascript
{
  customer: ObjectId (ref: Customer),
  packageType: Enum ['basic', 'premium', 'vip', 'custom'],
  startDate: Date (required),
  endDate: Date (required),
  price: Number (required),
  paymentStatus: Enum ['pending', 'paid', 'overdue', 'cancelled'],
  autoRenew: Boolean,
  isActive: Boolean,
  paymentMethod: Enum ['cash', 'card', 'bank_transfer', 'other'],
  notes: String,
  lastPaymentDate: Date,
  nextPaymentDate: Date
}
```

### Notification Model
```javascript
{
  customer: ObjectId (ref: Customer),
  subscription: ObjectId (ref: Subscription),
  type: Enum ['subscription_expiry', 'payment_reminder', 'welcome', 'custom'],
  title: String (required),
  message: String (required),
  status: Enum ['pending', 'sent', 'delivered', 'failed'],
  scheduledFor: Date,
  sentAt: Date,
  deliveryAttempts: Number,
  channel: Enum ['email', 'sms', 'push', 'all'],
  isAutomated: Boolean,
  metadata: Object
}
```

### Email Campaign Model
```javascript
{
  name: String (required),
  subject: String (required),
  template: Enum ['welcome', 'expiry_reminder', 'payment_reminder', 'promotion', 'custom'],
  content: String (required),
  status: Enum ['draft', 'scheduled', 'active', 'completed', 'paused'],
  targetAudience: Enum ['all', 'subscribed', 'expired', 'interested', 'custom'],
  customRecipients: [ObjectId],
  scheduledFor: Date,
  sentAt: Date,
  statistics: {
    totalRecipients: Number,
    sentCount: Number,
    deliveredCount: Number,
    openedCount: Number,
    failedCount: Number
  },
  settings: {
    trackOpens: Boolean,
    trackClicks: Boolean,
    sendImmediately: Boolean
  },
  createdBy: String,
  notes: String
}
```

## Security Features

### 🔐 Authentication
- JWT tokens with configurable expiration
- Secure password hashing with bcrypt
- Token refresh mechanism
- Session management

### 🛡️ Authorization
- Role-based access control (RBAC)
- Granular permission system
- Route-level protection
- API endpoint security

### 🔒 Security Headers
- CORS configuration
- Rate limiting ready
- Input validation
- SQL injection prevention (NoSQL)

## Error Handling

The system provides comprehensive error handling:
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **400 Bad Request** - Validation errors
- **500 Internal Server** - Server errors

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Node-cron** - Task scheduling
- **Joi** - Data validation
- **Morgan** - HTTP request logger

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # API controllers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middlewares/     # Custom middlewares
│   └── app.js           # Express app setup
├── postman/             # Postman collections
│   ├── Auth.postman_collection.json
│   ├── Customers.postman_collection.json
│   ├── Subscriptions.postman_collection.json
│   ├── Notifications.postman_collection.json
│   └── EmailCampaigns.postman_collection.json
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── server.js            # Server entry point
```

## Quick Start Guide

1. **Setup Environment**
   - Copy `.env.example` to `.env`
   - Configure your database and email settings

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```

4. **Create Admin User**
   - Import `postman/Auth.postman_collection.json` into Postman
   - Register first admin user using the collection

5. **Test API**
   - Import other Postman collections
   - Start with login to get auth token
   - Use token in all subsequent requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
