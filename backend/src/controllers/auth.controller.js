import AuthFacade from "../patterns/facade/auth.js";
import ERoleSingleton from "../patterns/singleton/ERole.js";
import { generateToken } from "../lib/utils.js";
import * as userService from "../services/user.service.js";
import { getAdmin } from "../services/admin.service.js";
import { getCustomer } from "../services/customer.service.js";
import { getSeller } from "../services/seller.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authFacade = new AuthFacade();

export const signUp = async (req, res) => {
  let userData = req.body;
  userData.password = await bcrypt.hash(userData.password, 10);
  try {
    const user = await authFacade.signUp(userData.role, {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phoneNumber: userData.phoneNumber,
      imageUrl: userData.imageUrl,
      status: true,
    });
    const token = generateToken(user.id, res);
    res.status(201).json({ user, token });
  } catch (error) {
    console.log("Error in signUp controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { role, email, password } = req.body;
  try {
    const user = await authFacade.login(role, email, password);
    const token = generateToken(user.id, res);
    res.status(200).json({ user, token });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    ERoleSingleton.reset();
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    // Get the actual user ID from the JWT token
    const token = req.cookies.jwt;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Get the user from the User table
    const user = await userService.getUser(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, imageUrl, image } = req.body;
  try {
    const updatedUser = await userService.updateUser(id, {
      name,
      email,
      phoneNumber,
      imageUrl,
      image,
    });
    if (updatedUser.role == "Admin") {
      const admin = await getAdmin(id);
      res.status(200).json({ user: admin });
    } else if (updatedUser.role == "Customer") {
      const customer = await getCustomer(id);
      res.status(200).json({ user: customer });
    } else {
      const seller = await getSeller(id);
      res.status(200).json({ user: seller });
    }
  } catch (error) {
    console.log("Error in updateProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ message: "No image provided" });
    }

    const imageUrl = await userService.uploadImage(image);
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.log("Error in uploadImage controller", error.message);
    res.status(500).json({ message: "Image upload failed" });
  }
};
