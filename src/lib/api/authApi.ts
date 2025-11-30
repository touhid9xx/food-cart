/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  User,
  ApiResponse,
  UserRole,
} from "../../types";
import { fakeUsers, fakeTokenStorage } from "../data";

// Fake API delay simulation
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper functions to manage token storage
const TokenManager = {
  setTokens: (accessToken: string, refreshToken: string) => {
    fakeTokenStorage.accessToken = accessToken;
    fakeTokenStorage.refreshToken = refreshToken;
  },

  clearTokens: () => {
    fakeTokenStorage.accessToken = null;
    fakeTokenStorage.refreshToken = null;
  },

  getAccessToken: () => fakeTokenStorage.accessToken,
  getRefreshToken: () => fakeTokenStorage.refreshToken,
};

// Generate fake JWT tokens with proper structure
const generateToken = (payload: any, expiresIn: string = "15m"): string => {
  const header = btoa(
    JSON.stringify({
      alg: "HS256",
      typ: "JWT",
    })
  );

  const expiration =
    Date.now() +
    (expiresIn === "15m"
      ? 15 * 60 * 1000
      : expiresIn === "1h"
      ? 60 * 60 * 1000
      : 7 * 24 * 60 * 60 * 1000); // 7 days for refresh tokens

  const data = {
    ...payload,
    exp: expiration,
    iat: Date.now(),
    iss: "food-order-api",
    aud: "food-order-app",
  };

  const payloadEncoded = btoa(JSON.stringify(data));
  const signature = btoa("fake_signature_" + Date.now());

  return `${header}.${payloadEncoded}.${signature}`;
};

// Verify fake JWT token
const verifyToken = (token: string): any => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid token format");

    const payload = JSON.parse(atob(parts[1]));

    // Check expiration
    if (payload.exp < Date.now()) {
      throw new Error("Token expired");
    }

    // Check issuer
    if (payload.iss !== "food-order-api") {
      throw new Error("Invalid token issuer");
    }

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
    throw new Error("Invalid token");
  }
};

// Password verification (in real app, you'd use bcrypt)
const verifyPassword = (
  inputPassword: string,
  storedPassword: string
): boolean => {
  return inputPassword === storedPassword;
};

// Helper function to create properly typed users
const createUserWithPassword = (
  userData: Omit<(typeof fakeUsers)[0], "id"> & { id?: string }
): (typeof fakeUsers)[0] => {
  return {
    id: userData.id || `user_${Date.now()}`,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    avatar: userData.avatar,
    isEmailVerified: userData.isEmailVerified,
    isPhoneVerified: userData.isPhoneVerified,
    password: userData.password,
  };
};

export const authApi = {
  // Login user
  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<AuthResponse>> => {
    await delay(800);

    const userWithPassword = fakeUsers.find(
      (u) => u.email === credentials.email
    );
    if (!userWithPassword) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    if (!verifyPassword(credentials.password, userWithPassword.password)) {
      throw new Error("Invalid email or password");
    }

    // Remove password from user object before returning
    const { password, ...user } = userWithPassword;

    const accessToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      "15m"
    );

    const refreshToken = generateToken(
      {
        userId: user.id,
        type: "refresh",
        tokenVersion: 1,
      },
      "7d"
    );

    // Store tokens
    TokenManager.setTokens(accessToken, refreshToken);

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
      message: "Login successful",
    };
  },

  // Register new user
  register: async (
    userData: RegisterData
  ): Promise<ApiResponse<AuthResponse>> => {
    await delay(1000);

    // Check if user already exists
    if (fakeUsers.find((u) => u.email === userData.email)) {
      throw new Error("User already exists with this email");
    }

    // Create properly typed new user
    const newUserWithPassword = createUserWithPassword({
      email: userData.email,
      name: userData.name,
      role: "customer",
      isEmailVerified: false,
      isPhoneVerified: false,
      password: userData.password,
    });

    fakeUsers.push(newUserWithPassword);

    // Remove password from user object before returning
    const { password, ...user } = newUserWithPassword;

    const accessToken = generateToken(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      "15m"
    );

    const refreshToken = generateToken(
      {
        userId: user.id,
        type: "refresh",
        tokenVersion: 1,
      },
      "7d"
    );

    // Store tokens
    TokenManager.setTokens(accessToken, refreshToken);

    return {
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
      message: "Registration successful! Welcome to our platform.",
    };
  },

  // Refresh access token
  refreshToken: async (): Promise<ApiResponse<RefreshTokenResponse>> => {
    await delay(500);

    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const payload = verifyToken(refreshToken);

      if (payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      const userWithPassword = fakeUsers.find((u) => u.id === payload.userId);
      if (!userWithPassword) {
        throw new Error("User not found");
      }

      // Remove password from user object
      const { password, ...user } = userWithPassword;

      const newAccessToken = generateToken(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
        "15m"
      );

      const newRefreshToken = generateToken(
        {
          userId: user.id,
          type: "refresh",
          tokenVersion: payload.tokenVersion + 1, // Increment token version
        },
        "7d"
      );

      // Update stored tokens
      TokenManager.setTokens(newAccessToken, newRefreshToken);

      return {
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: "Token refreshed successfully",
      };
    } catch (error) {
      // Clear invalid tokens
      TokenManager.clearTokens();
      throw new Error("Session expired. Please login again.");
    }
  },

  // Logout user
  logout: async (): Promise<ApiResponse<boolean>> => {
    await delay(300);

    // Clear tokens
    TokenManager.clearTokens();

    return {
      success: true,
      data: true,
      message: "Logout successful",
    };
  },

  // Get current user
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    await delay(400);

    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const payload = verifyToken(accessToken);
      const userWithPassword = fakeUsers.find((u) => u.id === payload.userId);

      if (!userWithPassword) {
        throw new Error("User not found");
      }

      // Remove password from user object before returning
      const { password, ...user } = userWithPassword;

      return {
        success: true,
        data: user,
        message: "User data retrieved successfully",
      };
    } catch (error) {
      // Try to refresh token if expired
      if (error instanceof Error && error.message.includes("Token expired")) {
        try {
          const refreshResponse = await authApi.refreshToken();
          if (refreshResponse.success) {
            // Retry getting user with new token
            return await authApi.getCurrentUser();
          }
        } catch (refreshError) {
          // Refresh failed, clear tokens
          TokenManager.clearTokens();
          throw new Error("Session expired. Please login again.");
        }
      }
      throw error;
    }
  },

  // Get demo accounts info (for the login page)
  getDemoAccounts: async (): Promise<
    ApiResponse<Array<{ email: string; role: UserRole; password: string }>>
  > => {
    await delay(200);

    const demoAccounts = fakeUsers
      .filter(
        (user) =>
          user.email === "john@tushar.com" || user.email === "admin@tushar.com"
      )
      .map((user) => ({
        email: user.email,
        role: user.role,
        password: user.password,
      }));

    return {
      success: true,
      data: demoAccounts,
      message: "Demo accounts retrieved",
    };
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<boolean>> => {
    await delay(800);

    // In a real app, you would verify the token and update the user
    const emailFromToken = atob(token); // Simple decoding for demo
    const user = fakeUsers.find((u) => u.email === emailFromToken);

    if (user) {
      user.isEmailVerified = true;
      return {
        success: true,
        data: true,
        message: "Email verified successfully",
      };
    }

    return {
      success: false,
      data: false,
      message: "Invalid verification token",
    };
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<ApiResponse<boolean>> => {
    await delay(600);

    const user = fakeUsers.find((u) => u.email === email);
    if (!user) {
      // Don't reveal if email exists or not
      return {
        success: true,
        data: true,
        message:
          "If an account with that email exists, we've sent a reset link",
      };
    }

    return {
      success: true,
      data: true,
      message: "If an account with that email exists, we've sent a reset link",
    };
  },

  // Reset password
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<boolean>> => {
    await delay(700);

    // In a real app, you would verify the reset token
    const emailFromToken = atob(token); // Simple decoding for demo
    const user = fakeUsers.find((u) => u.email === emailFromToken);

    if (user) {
      user.password = newPassword;
      return {
        success: true,
        data: true,
        message: "Password reset successfully",
      };
    }

    return {
      success: false,
      data: false,
      message: "Invalid reset token",
    };
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) return false;

    try {
      verifyToken(accessToken);
      return true;
    } catch {
      return false;
    }
  },

  // Get stored tokens (for debugging)
  getStoredTokens: () => {
    return {
      accessToken: TokenManager.getAccessToken(),
      refreshToken: TokenManager.getRefreshToken(),
    };
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<User>> => {
    await delay(600);

    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const payload = verifyToken(accessToken);
      const userIndex = fakeUsers.findIndex((u) => u.id === payload.userId);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      // Update user data
      fakeUsers[userIndex] = {
        ...fakeUsers[userIndex],
        ...updates,
      };

      // Remove password from returned user object
      const { password, ...user } = fakeUsers[userIndex];

      return {
        success: true,
        data: user,
        message: "Profile updated successfully",
      };
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<ApiResponse<boolean>> => {
    await delay(500);

    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }

    try {
      const payload = verifyToken(accessToken);
      const user = fakeUsers.find((u) => u.id === payload.userId);

      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      if (!verifyPassword(currentPassword, user.password)) {
        throw new Error("Current password is incorrect");
      }

      // Update password
      user.password = newPassword;

      return {
        success: true,
        data: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to change password");
    }
  },
};
