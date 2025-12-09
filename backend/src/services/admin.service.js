import Admin from "../models/admin.model.js";

export const getAdmin = async (userId) => {
  const admin = await Admin.findFirst({
    where: {
      userId: userId,
    },
    include: {
      user: true,
    },
  });
  return admin;
};
export const getAdminById = async (id) => {
  const admin = await Admin.findUnique({
    where: {
      id: id,
    },
  });
  return admin;
};
