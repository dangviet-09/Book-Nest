import React, { useEffect } from "react";
import { Store, BookOpen, Users } from "lucide-react";
import useShopStore from "../hooks/useShopStore";
import useAuthStore from "../hooks/useAuthStore";
import { Link } from "react-router-dom";

const ShopBooks = ({ books }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-4 text-base-content/60">
        No books available in this shop
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="card-body p-4">
            <h3 className="card-title text-lg">{book.abstraction}</h3>
            <p className="text-base-content/70 text-sm">
              Price: {book.price || "Unknown Price"}
            </p>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <img src={book.imageUrl} alt={book.abstraction} />
            </div>
            <div className="card-actions justify-end mt-2">
              <Link to={`/book/${book.id}`} className="btn btn-sm btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const FollowedShopsPage = () => {
  const { authUser } = useAuthStore();
  const { followedShops, isLoadingFollowedShops, getFollowedShops } =
    useShopStore();

  const customerId = authUser?.id;

  useEffect(() => {
    if (customerId) {
      getFollowedShops(customerId);
    }
  }, [customerId, getFollowedShops]);

  if (isLoadingFollowedShops) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading followed shops...</p>
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
            Your Followed Shops
          </h1>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Browse books from your favorite shops
          </p>
        </div>

        {/* Stats */}
        <div className="stats shadow mb-8 w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Store className="h-8 w-8" />
            </div>
            <div className="stat-title">Followed Shops</div>
            <div className="stat-value text-primary">
              {followedShops.length}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <BookOpen className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Books</div>
            <div className="stat-value text-secondary">
              {followedShops.reduce(
                (total, shop) => total + (shop._count?.books || 0),
                0
              )}
            </div>
          </div>
        </div>

        {/* Shops and Books */}
        {followedShops.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">
              No followed shops yet
            </h3>
            <p className="text-base-content/50 mb-4">
              Start following shops to see their books here!
            </p>
            <Link to="/shops" className="btn btn-primary">
              Browse Shops
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {followedShops.map((shop) => (
              <div key={shop.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
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
                    <div className="flex items-center gap-4 text-sm text-base-content/70">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>{shop._count?.books || 0} books</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{shop._count?.observers || 0} followers</span>
                      </div>
                    </div>
                  </div>

                  <div className="divider"></div>

                  <ShopBooks books={shop.books} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedShopsPage;
