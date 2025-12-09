import UserFactory from "./UserFactory.js";
import Admin from "../../models/admin.model.js";
import User from "../../models/user.model.js";
import { getAdmin } from "../../services/admin.service.js";

class CreateStaffUser extends UserFactory {
  async createUser(role, data) {
    switch (role.getRole()) {
      case "Admin":
        const existingUser = await User.findUnique({
          where: { email: data.email },
        });
        if (existingUser) {
          console.log("User with this email already exists");
          return null;
        }
        // Create the User with role = Admin
        let user = await User.create({
          data: {
            email: data.email,
            name: data.name,
            password: data.password,
            phoneNumber: data.phoneNumber,
            imageUrl: data.imageUrl,
            status: true, // or false if default inactive
            role: role.getRole(),
          },
        });
        // Create the Admin record linked to the user
        const admin = await Admin.create({
          data: {
            user: {
              connect: { id: user.id },
            },
          },
        });
        user = await getAdmin(user.id);
        return user;
      default:
        console.log("Invalid role");
        return null;
    }
  }
}

export default CreateStaffUser;
