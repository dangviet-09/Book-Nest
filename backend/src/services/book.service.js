import Book from "../models/book.model.js";
import cloudinary from "../lib/cloudinary.js";
import { createNotification } from "./notification.service.js";
import { getShopById } from "./shop.service.js";

export const createBook = async (shopId, bookData) => {
  try {
    const shop = await getShopById(shopId);
    const genreArray = bookData.genre.split(",");

    // Create notifications for all shop followers
    if (shop.observers && shop.observers.length > 0) {
      await Promise.all(
        shop.observers.map(async (customer) => {
          await createNotification({
            customerId: customer.id,
            content: `New book available: ${bookData.abstraction}`,
          });
        })
      );
    }

    // Create the book
    const newBook = await Book.create({
      data: {
        abstraction: bookData.abstraction,
        fileUrl: bookData.fileUrl,
        imageUrl: bookData.imageUrl,
        genre: {
          set: genreArray,
        },
        price: parseFloat(bookData.price),
        shop: {
          connect: { id: shopId },
        },
      },
    });

    return newBook;
  } catch (error) {
    console.error("Error in createBook service:", error);
    throw error;
  }
};

export const uploadBookFile = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "books",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getBooksByShopId = async (shopId) => {
  const books = await Book.findMany({
    where: { shopId },
    include: {
      shop: true,
    },
  });
  return books;
};
