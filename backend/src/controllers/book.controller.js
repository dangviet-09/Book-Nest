import { createBook as createBookService } from "../services/book.service.js";
import { uploadBookFile } from "../services/book.service.js";
import { getBooksByShopId as getBooksByShopIdService } from "../services/book.service.js";

export const createBook = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { abstraction, price, imageBook, genre, fileBook } = req.body;

    const imageUrl = await uploadBookFile(imageBook);
    const fileUrl = await uploadBookFile(fileBook);

    const book = await createBookService(shopId, {
      abstraction,
      price,
      imageUrl,
      genre,
      fileUrl,
    });

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("Error in createBook controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBooksByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;
    const books = await getBooksByShopIdService(shopId);
    res.status(200).json(books);
  } catch (error) {
    console.log("Error in getBooksByShopId controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
