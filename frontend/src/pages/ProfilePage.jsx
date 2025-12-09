import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../hooks/useAuthStore";

const ProfilePage = () => {
  const {
    authUser,
    updateProfile,
    uploadImage,
    isUpdatingProfile,
    isUploadingImage,
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: authUser?.user?.name || "",
    email: authUser?.user?.email || "",
    phoneNumber: authUser?.user?.phoneNumber || "",
  });

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Helper function to compress and resize image
  const compressImage = (
    file,
    maxWidth = 300,
    maxHeight = 300,
    quality = 0.6
  ) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (more aggressive for profile pics)
        let { width, height } = img;

        // For profile pictures, keep them small
        const maxDimension = Math.max(maxWidth, maxHeight);

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to blob with compression
        canvas.toBlob(resolve, "image/jpeg", quality);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type first
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Invalid file type! Please choose a JPG, PNG, or GIF image."
        );
        e.target.value = ""; // Clear the input
        return;
      }

      try {
        // Show loading toast
        const loadingToast = toast.loading("Processing image...");

        // Compress the image
        let compressedFile = await compressImage(file);

        // Check compressed file size (500KB limit for API)
        const maxSize = 500 * 1024; // 500KB in bytes

        // If still too large, try more aggressive compression
        if (compressedFile.size > maxSize) {
          compressedFile = await compressImage(file, 200, 200, 0.4); // Very small, low quality

          if (compressedFile.size > maxSize) {
            // Final attempt with minimal quality
            compressedFile = await compressImage(file, 150, 150, 0.3);

            if (compressedFile.size > maxSize) {
              toast.dismiss(loadingToast);
              toast.error(
                "Image is still too large after maximum compression. Please choose a much smaller image."
              );
              e.target.value = ""; // Clear the input
              return;
            }
          }
        }

        setImageFile(compressedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
          toast.dismiss(loadingToast);
          toast.success(
            `Image processed successfully! (${formatFileSize(
              compressedFile.size
            )})`
          );
        };
        reader.onerror = () => {
          toast.dismiss(loadingToast);
          toast.error("Error reading the image file. Please try again.");
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error("Error processing image. Please try again.");
        e.target.value = ""; // Clear the input
      }
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = authUser?.user?.imageUrl || "";

      // If there's a new image, upload it first
      if (imageFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          try {
            // Upload image first and get the URL
            const uploadedUrl = await uploadImage(reader.result);
            imageUrl = uploadedUrl;
            setUploadedImageUrl(uploadedUrl);

            // Now update profile with the new image URL
            const updateData = {
              name: formData.name,
              phoneNumber: formData.phoneNumber,
              imageUrl: imageUrl,
              image: "", // No need to send image data since we already uploaded it
            };

            await updateProfile(authUser.user.id, updateData);

            // Reset form state
            setIsEditing(false);
            setImagePreview(null);
            setImageFile(null);
            setUploadedImageUrl(null);
          } catch (error) {
            console.error("Error in image upload or profile update:", error);
          }
        };
        reader.readAsDataURL(imageFile);
      } else {
        // No new image, just update other fields
        const updateData = {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          imageUrl: imageUrl,
          image: "", // No new image
        };

        await updateProfile(authUser.user.id, updateData);

        // Reset form state
        setIsEditing(false);
        setImagePreview(null);
        setImageFile(null);
        setUploadedImageUrl(null);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error is already handled by the store with toast
    }
  };

  const handleCancel = () => {
    setFormData({
      name: authUser?.user?.name || "",
      email: authUser?.user?.email || "",
      phoneNumber: authUser?.user?.phoneNumber || "",
    });
    setImagePreview(null);
    setImageFile(null);
    setIsEditing(false);
  };

  // Update form data when authUser changes (after successful update)
  React.useEffect(() => {
    if (authUser?.user) {
      setFormData({
        name: authUser.user.name || "",
        email: authUser.user.email || "",
        phoneNumber: authUser.user.phoneNumber || "",
      });
    }
  }, [authUser]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="avatar mb-4 relative">
              <div className="w-24 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : authUser?.user?.imageUrl ? (
                  <img
                    src={authUser.user.imageUrl}
                    alt={authUser.user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="h-12 w-12" />
                )}
              </div>
              {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <label className="btn btn-circle btn-sm btn-primary cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-base-content">
              {authUser?.user?.name}
            </h1>
            <p className="text-base-content/70 mt-2">
              {authUser?.user?.role} • Member since today
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary btn-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={isUpdatingProfile || isUploadingImage}
                      className="btn btn-success btn-sm"
                    >
                      {isUploadingImage ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Uploading Image...
                        </>
                      ) : isUpdatingProfile ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Saving Profile...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-ghost btn-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profile Image Upload */}
                {isEditing && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Profile Image
                      </span>
                    </label>
                    <div className="flex flex-col gap-4">
                      {/* Current/Preview Image */}
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 rounded-full bg-base-200">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : authUser?.user?.imageUrl ? (
                              <img
                                src={authUser.user.imageUrl}
                                alt={authUser.user.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="h-8 w-8 text-base-content/40" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="btn btn-outline btn-sm cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-base-content/50 mt-1">
                            JPG, PNG or GIF (auto-compressed to under 500KB)
                          </p>
                        </div>
                      </div>
                      {imageFile && (
                        <div
                          className={`alert ${
                            isUploadingImage ? "alert-warning" : "alert-info"
                          }`}
                        >
                          <Info className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span>
                              {isUploadingImage
                                ? "Uploading image..."
                                : `New image selected: ${imageFile.name}`}
                            </span>
                            <span className="text-xs opacity-70">
                              Size: {formatFileSize(imageFile.size)}
                            </span>
                          </div>
                          {isUploadingImage && (
                            <span className="loading loading-spinner loading-sm"></span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      placeholder={`${authUser?.user?.name}`}
                      className={`input input-bordered w-full pl-10 ${
                        !isEditing ? "input-disabled" : ""
                      }`}
                      disabled={!isEditing}
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
                      placeholder={`${authUser?.user?.email}`}
                      className="input input-bordered w-full pl-10 input-disabled"
                      disabled
                    />
                  </div>
                  <label className="label">
                    <span className="label-text-alt text-base-content/50">
                      Email cannot be changed
                    </span>
                  </label>
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
                      placeholder={`${authUser?.user?.phoneNumber}`}
                      className={`input input-bordered w-full pl-10 ${
                        !isEditing ? "input-disabled" : ""
                      }`}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Role</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span
                      className={`badge badge-lg ${
                        authUser?.user?.role === "Admin"
                          ? "badge-error"
                          : authUser?.user?.role === "Seller"
                          ? "badge-warning"
                          : "badge-primary"
                      }`}
                    >
                      {authUser?.user?.role}
                    </span>
                    <span className="text-sm text-base-content/50">
                      Role cannot be changed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Profile Stats */}
          <div className="mt-8">
            <div className="stats shadow w-full">
              <div className="stat">
                <div className="stat-title">Account Status</div>
                <div className="stat-value text-success">
                  {authUser?.user?.status ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
