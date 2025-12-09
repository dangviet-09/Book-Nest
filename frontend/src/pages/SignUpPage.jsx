import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Lock, User, Phone } from "lucide-react";
import useAuthStore from "../hooks/useAuthStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    role: "Customer", // Default role
    email: "",
    password: "",
    name: "",
    phoneNumber: "",
  });

  const { signup, isSigningUp } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.email ||
      !formData.password ||
      !formData.name ||
      !formData.phoneNumber
    ) {
      return;
    }

    // Password validation
    if (formData.password.length < 6) {
      return;
    }

    try {
      // Ensure imageUrl is sent as empty string
      const signupData = {
        ...formData,
        imageUrl: "",
      };
      await signup(signupData);
      navigate("/"); // Redirect to home page after successful signup
    } catch (error) {
      // Error is handled by the store with toast
      console.error("Signup failed:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-content">
            <UserPlus className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-base-content">
            Join BookNest
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Create your account to start your reading journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Role Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Role</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            {/* Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/50">
                  Password must be at least 6 characters long
                </span>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-primary w-full"
            >
              {isSigningUp ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Create account
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary-focus"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
