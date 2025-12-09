import React, { useState } from "react";
import { X } from "lucide-react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import useAuthStore from "../hooks/useAuthStore";

const CreateBookForm = ({ isOpen, onClose, onSuccess }) => {
  const { authUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    abstraction: "",
    price: "",
    genre: [],
    imageBook: null,
    fileBook: null,
  });
  const [genreInput, setGenreInput] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleGenreInputChange = (e) => {
    setGenreInput(e.target.value);
  };

  const handleAddGenre = () => {
    if (genreInput.trim() && !formData.genre.includes(genreInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        genre: [...prev.genre, genreInput.trim()],
      }));
      setGenreInput("");
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.filter((genre) => genre !== genreToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddGenre();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser?.shopId) {
      toast.error("Shop ID not found. Please try logging in again.");
      return;
    }

    if (formData.genre.length === 0) {
      toast.error("Please add at least one genre");
      return;
    }

    setIsLoading(true);

    try {
      // Convert files to base64
      const imageBase64 = await convertToBase64(formData.imageBook);
      const fileBase64 = await convertToBase64(formData.fileBook);

      // Create book
      const response = await axiosInstance.post(`/books/${authUser.shopId}`, {
        ...formData,
        imageBook: imageBase64,
        fileBook: fileBase64,
      });

      toast.success("Book created successfully!");
      onSuccess(response.data.book);
      onClose();
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error(error.response?.data?.message || "Failed to create book");
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add New Book</h2>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Book Abstraction</span>
            </label>
            <input
              type="text"
              name="abstraction"
              value={formData.abstraction}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Price ($)</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input input-bordered"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Genres</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={genreInput}
                onChange={handleGenreInputChange}
                onKeyPress={handleKeyPress}
                className="input input-bordered flex-1"
                placeholder="Add a genre and press Enter"
              />
              <button
                type="button"
                onClick={handleAddGenre}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genre.map((genre) => (
                <div key={genre} className="badge badge-primary gap-2">
                  {genre}
                  <button
                    type="button"
                    onClick={() => handleRemoveGenre(genre)}
                    className="btn btn-ghost btn-xs"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Book Cover Image</span>
            </label>
            <input
              type="file"
              name="imageBook"
              onChange={handleChange}
              className="file-input file-input-bordered w-full"
              accept="image/*"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Book File (PDF)</span>
            </label>
            <input
              type="file"
              name="fileBook"
              onChange={handleChange}
              className="file-input file-input-bordered w-full"
              accept=".pdf"
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Book"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBookForm;
