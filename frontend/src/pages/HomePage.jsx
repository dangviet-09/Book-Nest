import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Star, ArrowRight } from "lucide-react";
import useAuthStore from "../hooks/useAuthStore";

const HomePage = () => {
  const { authUser } = useAuthStore();

  if (authUser) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Welcome back, {authUser.user.name}! 📚
            </h1>
            <p className="text-lg text-base-content/70">
              Ready to continue your reading journey?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h2 className="card-title justify-center">My Library</h2>
                <p>Access your personal book collection</p>
                <div className="card-actions justify-center">
                  <button className="btn btn-primary">View Books</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Star className="h-12 w-12 mx-auto text-primary mb-4" />
                <h2 className="card-title justify-center">Recommendations</h2>
                <p>Discover new books based on your interests</p>
                <div className="card-actions justify-center">
                  <button className="btn btn-primary">Explore</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <h2 className="card-title justify-center">Community</h2>
                <p>Connect with other book lovers</p>
                <div className="card-actions justify-center">
                  <button className="btn btn-primary">Join</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title">Your Role</div>
                <div className="stat-value text-primary">
                  {authUser.user.role}
                </div>
                <div className="stat-desc">Member since today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <div className="mb-8">
              <BookOpen className="h-24 w-24 mx-auto text-primary mb-4" />
            </div>
            <h1 className="text-5xl font-bold text-base-content">BookNest</h1>
            <p className="py-6 text-lg text-base-content/70">
              Your digital sanctuary for books. Discover, collect, and share
              your favorite reads with a community of book lovers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-base-content mb-4">
              Why Choose BookNest?
            </h2>
            <p className="text-lg text-base-content/70">
              Everything you need to manage and enjoy your reading experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personal Library</h3>
              <p className="text-base-content/70">
                Organize your books, track your reading progress, and build your
                digital library.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-base-content/70">
                Connect with fellow readers, share reviews, and discover new
                books through recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Smart Recommendations
              </h3>
              <p className="text-base-content/70">
                Get personalized book suggestions based on your reading history
                and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Reading Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of book lovers who have made BookNest their reading
            home.
          </p>
          <Link to="/signup" className="btn btn-secondary btn-lg">
            Create Your Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
