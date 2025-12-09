import Shop from "../models/shop.model.js";
import Customer from "../models/customer.model.js";

export const getAllShops = async () => {
  try {
    const shops = await Shop.findMany({
      include: {
        seller: {
          include: {
            user: true,
          },
        },
        books: true,
        observers: true,
        _count: {
          select: {
            books: true,
            observers: true,
          },
        },
      },
    });
    return shops;
  } catch (error) {
    throw new Error(`Failed to get shops: ${error.message}`);
  }
};

export const getShopById = async (shopId) => {
  try {
    const shop = await Shop.findUnique({
      where: { id: shopId },
      include: {
        books: true,
        observers: true,
        seller: {
          include: {
            user: true,
          },
        },
      },
    });
    return shop;
  } catch (error) {
    throw new Error(`Failed to get shop: ${error.message}`);
  }
};

export const followShop = async (customerId, shopId) => {
  try {
    // Check if customer is already following the shop
    const customer = await Customer.findUnique({
      where: { id: customerId },
      include: { shop: true },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const isAlreadyFollowing = customer.shop.some((shop) => shop.id === shopId);
    if (isAlreadyFollowing) {
      throw new Error("Already following this shop");
    }

    // Add shop to customer's followed shops
    const updatedCustomer = await Customer.update({
      where: { id: customerId },
      data: {
        shop: {
          connect: { id: shopId },
        },
      },
      include: {
        shop: true,
        user: true,
      },
    });

    return updatedCustomer;
  } catch (error) {
    throw new Error(`Failed to follow shop: ${error.message}`);
  }
};

export const unfollowShop = async (customerId, shopId) => {
  try {
    // Check if customer is following the shop
    const customer = await Customer.findUnique({
      where: { id: customerId },
      include: { shop: true },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    const isFollowing = customer.shop.some((shop) => shop.id === shopId);
    if (!isFollowing) {
      throw new Error("Not following this shop");
    }

    // Remove shop from customer's followed shops
    const updatedCustomer = await Customer.update({
      where: { id: customerId },
      data: {
        shop: {
          disconnect: { id: shopId },
        },
      },
      include: {
        shop: true,
        user: true,
      },
    });

    return updatedCustomer;
  } catch (error) {
    throw new Error(`Failed to unfollow shop: ${error.message}`);
  }
};

export const getFollowedShops = async (customerId) => {
  try {
    const customer = await Customer.findUnique({
      where: { id: customerId },
      include: {
        shop: {
          include: {
            seller: {
              include: {
                user: true,
              },
            },
            books: true,
            _count: {
              select: {
                books: true,
                observers: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return customer.shop;
  } catch (error) {
    throw new Error(`Failed to get followed shops: ${error.message}`);
  }
};

export const isFollowingShop = async (customerId, shopId) => {
  try {
    const customer = await Customer.findUnique({
      where: { id: customerId },
      include: { shop: true },
    });

    if (!customer) {
      return false;
    }

    return customer.shop.some((shop) => shop.id === shopId);
  } catch (error) {
    throw new Error(`Failed to check follow status: ${error.message}`);
  }
};
