import Customer from "../models/customer.model.js";

export const getCustomer = async (userId) => {
  const customer = await Customer.findFirst({
    where: {
      userId: userId,
    },
    include: {
      user: true,
    },
  });
  return customer;
};
export const getCustomerById = async (id) => {
  const customer = await Customer.findUnique({
    where: {
      id: id,
    },
  });
  return customer;
};
