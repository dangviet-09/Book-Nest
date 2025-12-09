import jwt from "jsonwebtoken";
import { getAdminById } from "../services/admin.service.js";
import { getSellerById } from "../services/seller.service.js";
import { getCustomerById } from "../services/customer.service.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const admin = await getAdminById(decoded.userId);
    const seller = await getSellerById(decoded.userId);
    const customer = await getCustomerById(decoded.userId);
    let user;
    if (admin) {
      user = admin;
    } else if (seller) {
      user = seller;
    } else if (customer) {
      user = customer;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
