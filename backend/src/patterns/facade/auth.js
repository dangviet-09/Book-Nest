import UserFactory from "../factoryMethod/UserFactory.js";
import CreateNormalUser from "../factoryMethod/CreateNormalUser.js";
import CreateStaffUser from "../factoryMethod/CreateStaffUser.js";
import ERoleSingleton from "../singleton/ERole.js";
import bcrypt from "bcrypt";
import User from "../../models/user.model.js";
import { getAdmin } from "../../services/admin.service.js";
import { getSeller } from "../../services/seller.service.js";
import { getCustomer } from "../../services/customer.service.js";

class AuthFacade {
  constructor() {
    this.userFactory = new UserFactory();
    this.createNormalUser = new CreateNormalUser();
    this.createStaffUser = new CreateStaffUser();
  }

  async signUp(role, data) {
    const userRole = ERoleSingleton.getInstance(role);
    if (role === "Admin") {
      return this.createStaffUser.createUser(userRole, data);
    } else if (role === "Seller") {
      return this.createNormalUser.createUser(userRole, data);
    } else if (role === "Customer") {
      return this.createNormalUser.createUser(userRole, data);
    }
    return null;
  }

  async login(role, email, password) {
    const user = await User.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found");
      return null;
    }
    const result = bcrypt.compare(password, user.password);
    if (!result) {
      console.log("Invalid password");
      return null;
    }
    switch (role) {
      case "Admin":
        return await getAdmin(user.id);
      case "Seller":
        return await getSeller(user.id);
      case "Customer":
        return await getCustomer(user.id);
      default:
        return null;
    }
  }
}

export default AuthFacade;
