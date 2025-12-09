import UserFactory from "./UserFactory.js";
import User from "../../models/user.model.js";
import Customer from "../../models/customer.model.js";
import Seller from "../../models/seller.model.js";
import { getCustomer } from "../../services/customer.service.js";
import { getSeller } from "../../services/seller.service.js";

class CreateNormalUser extends UserFactory {
  async createUser(role, data) {
    const roleName = role.getRole();

    // Check if user already exists
    const existingUser = await User.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      console.log("User with this email already exists");
      return null;
    }

    // Create base user
    let user = await User.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        imageUrl: data.imageUrl,
        status: true,
        role: roleName,
      },
    });

    // Create role-specific entry
    switch (roleName) {
      case "Customer":
        const customer = await Customer.create({
          data: {
            user: {
              connect: { id: user.id },
            },
          },
        });
        user = await getCustomer(user.id);
        return user;

      case "Seller":
        const seller = await Seller.create({
          data: {
            user: {
              connect: { id: user.id },
            },
            shop: {
              create: {
                name: data.shopName || `${user.name}'s Shop`, // optional dynamic shop name
              },
            },
          },
        });
        user = await getSeller(user.id);
        return user;
      default:
        console.log("Invalid role");
        return null;
    }
  }
}

export default CreateNormalUser;
