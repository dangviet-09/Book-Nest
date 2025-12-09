import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const createUser = async (userData) => {
  try {
    const user = await User.create({
      data: userData,
    });
    return user;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const getUser = async (id) => {
  try {
    const user = await User.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

export const updateUser = async (id, userData) => {
  // If there's a new imageUrl and it's different from the current one, delete the old image
  if (userData.imageUrl && userData.imageUrl !== "") {
    const currentUser = await User.findUnique({ where: { id } });
    if (currentUser?.imageUrl && currentUser.imageUrl !== userData.imageUrl) {
      await deleteImage(currentUser.imageUrl);
    }
  }

  // Remove the image field since we're not processing it here anymore
  const { image, ...updateData } = userData;

  return await User.update({ where: { id }, data: updateData });
};

export const uploadImage = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "users",
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

export const deleteImage = async (url) => {
  try {
    const publicId = url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};
