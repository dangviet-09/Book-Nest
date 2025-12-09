import React, { useEffect } from "react";
import {
  Store,
  Users,
  BookOpen,
  Heart,
  HeartOff,
  MapPin,
  Star,
} from "lucide-react";
import useShopStore from "../hooks/useShopStore";
import useAuthStore from "../hooks/useAuthStore";
import toast from "react-hot-toast";

const ShopCard = ({
  shop,
  onFollow,
  onUnfollow,
  isFollowing,
  isCustomer,
  isLoading,
}) => {
  const followersCount = shop._count?.observers || 0;
  const booksCount = shop._count?.books || 0;
  const [isLoadingAction, setIsLoadingAction] = React.useState(false);

  const handleFollowClick = async () => {
    if (!isCustomer) {
      toast.error("Only customers can follow shops");
      return;
    }
    setIsLoadingAction(true);
    try {
      if (isFollowing) {
        await onUnfollow(shop.id);
      } else {
        await onFollow(shop.id);
      }
    } finally {
      setIsLoadingAction(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {shop.seller?.user?.imageUrl ? (
                  <img
                    src={shop.seller.user.imageUrl}
                    alt={shop.seller.user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Store className="h-6 w-6" />
                )}
              </div>
            </div>
            <div>
              <h2 className="card-title text-lg">{shop.name}</h2>
              <p className="text-base-content/60 text-sm">
                by {shop.seller?.user?.name || "Unknown Seller"}
              </p>
            </div>
          </div>

          {isCustomer && (
            <button
              onClick={handleFollowClick}
              disabled={isLoadingAction}
              className={`btn btn-sm ${
                isFollowing ? "btn-error" : "btn-primary"
              }`}
            >
              {isLoadingAction ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : isFollowing ? (
                <>
                  <HeartOff className="h-4 w-4" />
                  Unfollow
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4" />
                  Follow
                </>
              )}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>{booksCount} books</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{followersCount} followers</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-outline btn-sm">View Shop</button>
        </div>
      </div>
    </div>
  );
};

const ShopsPage = () => {
  const { authUser } = useAuthStore();
  const {
    shops,
    isLoadingShops,
    isFollowingShop,
    isUnfollowingShop,
    getAllShops,
    followShop,
    unfollowShop,
    checkIsFollowingShop,
  } = useShopStore();

  const isCustomer = authUser?.user?.role === "Customer";
  const customerId = isCustomer ? authUser?.id : null;

  useEffect(() => {
    getAllShops();
  }, [getAllShops]);

  const handleFollow = async (shopId) => {
    if (!customerId) return;
    try {
      await followShop(shopId, customerId);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  const handleUnfollow = async (shopId) => {
    if (!customerId) return;
    try {
      await unfollowShop(shopId, customerId);
    } catch (error) {
      // Error is already handled in the store
    }
  };

  if (isLoadingShops) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading shops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Discover Amazing Shops
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Explore our collection of book shops and find your next favorite
            read
          </p>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Store className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Shops</div>
            <div className="stat-value text-primary">{shops.length}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Books</div>
            <div className="stat-value text-secondary">
              {shops.reduce(
                (total, shop) => total + (shop._count?.books || 0),
                0
              )}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-accent">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Followers</div>
            <div className="stat-value text-accent">
              {shops.reduce(
                (total, shop) => total + (shop._count?.observers || 0),
                0
              )}
            </div>
          </div>
        </div>

        {/* Customer Notice */}
        {!isCustomer && authUser?.user && (
          <div className="alert alert-info mb-6">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>
                Only customers can follow shops. You are logged in as{" "}
                {authUser.user.role}.
              </span>
            </div>
          </div>
        )}

        {/* Shops Grid */}
        {shops.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">
              No shops found
            </h3>
            <p className="text-base-content/50">
              Check back later for new shops!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                onFollow={handleFollow}
                onUnfollow={handleUnfollow}
                isFollowing={checkIsFollowingShop(shop.id, customerId)}
                isCustomer={isCustomer}
                isLoading={isFollowingShop || isUnfollowingShop}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;
