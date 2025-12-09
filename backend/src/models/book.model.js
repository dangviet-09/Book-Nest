import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const Book = prisma.book;

export default Book;
