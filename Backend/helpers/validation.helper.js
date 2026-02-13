/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const isValidPassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  // More password strength checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return {
      isValid: false,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }

  return { isValid: true, message: "Password is valid" };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const isValidName = (name) => {
  if (!name || name.trim().length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: "Name cannot exceed 50 characters",
    };
  }

  return { isValid: true, message: "Name is valid" };
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} - True if valid ObjectId
 */
export const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

/**
 * Sanitize user input (remove extra spaces, trim)
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/\s+/g, " ");
};
