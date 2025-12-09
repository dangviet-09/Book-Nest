import Seller from "../models/seller.model.js";

export const getSeller = async (userId) => {
  const seller = await Seller.findFirst({
    where: {
      userId: userId,
    },
    include: {
      user: true,
    },
  });
  return seller;
};
export const getSellerById = async (id) => {
  const seller = await Seller.findUnique({
    where: {
      id: id,
    },
  });
  return seller;
};
