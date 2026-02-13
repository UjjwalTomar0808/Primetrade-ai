import User from "../models/User.js";
import { hashPassword, comparePassword } from "../helpers/password.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";
import {
  ApiError,
  asyncHandler,
  successResponse,
} from "../helpers/error.helper.js";
import {
  isValidEmail,
  isValidPassword,
  isValidName,
  sanitizeInput,
} from "../helpers/validation.helper.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Validate name
  const nameValidation = isValidName(name);
  if (!nameValidation.isValid) {
    throw new ApiError(400, nameValidation.message);
  }

  // Validate email
  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Validate password
  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.isValid) {
    throw new ApiError(400, passwordValidation.message);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    name: sanitizeInput(name),
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // Generate token
  const token = generateToken({ userId: user._id });

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt,
  };

  return successResponse(res, 201, "User registered successfully", {
    user: userResponse,
    token,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, "Please provide a valid email address");
  }

  // Find user (include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, "Account is deactivated. Please contact support");
  }

  // Compare password
  const isPasswordMatch = await comparePassword(password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  // Generate token
  const token = generateToken({ userId: user._id });

  // Remove password from response
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    role: user.role,
    createdAt: user.createdAt,
  };

  return successResponse(res, 200, "Login successful", {
    user: userResponse,
    token,
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return successResponse(res, 200, "User fetched successfully", { user });
});

/**
 * @desc    Logout user (client-side token removal)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // In JWT-based auth, logout is handled client-side by removing the token
  // This endpoint can be used for logging purposes or future enhancements
  
  return successResponse(res, 200, "Logout successful", null);
});
