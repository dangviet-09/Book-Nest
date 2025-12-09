import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const Notification = prisma.notification;
export default Notification;
