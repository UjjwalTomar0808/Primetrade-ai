import User from "../models/User.js";
import Task from "../models/Task.js";
import { hashPassword } from "../helpers/password.helper.js";
import {
  ApiError,
  asyncHandler,
  successResponse,
} from "../helpers/error.helper.js";
import {
  isValidName,
  isValidPassword,
  sanitizeInput,
} from "../helpers/validation.helper.js";

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/profile
 * @access  Private
 */
export const getProfile = asyncHandler(async (req, res) => {
  const user = req.user;

  return successResponse(res, 200, "Profile fetched successfully", { user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;
  const userId = req.user._id;

  // Build update object
  const updates = {};

  if (name !== undefined) {
    const nameValidation = isValidName(name);
    if (!nameValidation.isValid) {
      throw new ApiError(400, nameValidation.message);
    }
    updates.name = sanitizeInput(name);
  }

  if (bio !== undefined) {
    if (bio.length > 200) {
      throw new ApiError(400, "Bio cannot exceed 200 characters");
    }
    updates.bio = sanitizeInput(bio);
  }

  if (avatar !== undefined) {
    updates.avatar = avatar;
  }

  // Update user
  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return successResponse(res, 200, "Profile updated successfully", { user });
});

/**
 * @desc    Update user password
 * @route   PUT /api/v1/users/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Please provide current and new password");
  }

  // Get user with password
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify current password
  const { comparePassword } = await import("../helpers/password.helper.js");
  const isMatch = await comparePassword(currentPassword, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  // Validate new password
  const passwordValidation = isValidPassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new ApiError(400, passwordValidation.message);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  user.password = hashedPassword;
  await user.save();

  return successResponse(res, 200, "Password updated successfully", null);
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/account
 * @access  Private
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete all tasks associated with the user
  await Task.deleteMany({ user: userId });
  
  return successResponse(res, 200, "Account deleted successfully", null);
});
