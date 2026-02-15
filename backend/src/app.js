import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import customerRoutes from "./routes/customer.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import emailCampaignRoutes from "./routes/emailCampaign.routes.js";
import authRoutes from "./routes/auth.routes.js";
import cronRoutes from "./routes/cron.routes.js";
// import { CronService } from "./services/cron.service.js";

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://coach-gym-v1.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-requested-with',
    'Content-Disposition',
  ],
  exposedHeaders: ['Content-Disposition', 'Content-Type', 'Content-Length'],
}));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/cron", cronRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/email-campaigns", emailCampaignRoutes);

// // Initialize cron jobs
// CronService.initializeCronJobs();

app.use(notFound);
app.use(errorMiddleware);

export default app;