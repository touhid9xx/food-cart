/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { registerUser } from "../../lib/slices/authSlice";
import { useAlert } from "../../lib/hooks/useAlert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { success, error, warning, info, clear } = useAlert(); // Added 'info' here
  const router = useRouter();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      success("Account created successfully! Redirecting...", "Welcome!", 2000);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }, [isAuthenticated, router, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInputFocus = () => {
    clear();
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phone
    ) {
      error("Please fill in all required fields", "Missing Information");
      return false;
    }

    if (!validateEmail(formData.email)) {
      error("Please enter a valid email address", "Invalid Email");
      return false;
    }

    if (formData.password.length < 6) {
      error("Password must be at least 6 characters long", "Weak Password");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      error("Passwords don't match", "Password Mismatch");
      return false;
    }

    if (!formData.agreeToTerms) {
      warning("Please agree to the terms and conditions", "Terms Required");
      return false;
    }

    return true;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();

    if (!validateForm()) {
      return;
    }

    try {
      info("Creating your account...", "Registration in Progress"); // This line was causing the error
      const { confirmPassword, agreeToTerms, ...registerData } = formData;
      const result = await dispatch(registerUser(registerData)).unwrap();
      success(
        `Welcome to our community, ${result.user?.name || "User"}!`,
        "Registration Successful"
      );
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err ||
        "Registration failed. Please try again.";
      error(errorMessage, "Registration Failed");
    }
  };

  const getThemeGradient = () => {
    return "bg-gradient-to-br from-green-50/80 via-white/90 to-blue-50/80 dark:from-green-900/20 dark:via-gray-900 dark:to-blue-900/20";
  };

  const getButtonGradient = () => {
    return "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${getThemeGradient()} py-12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-out`}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Animated Header Card */}
        <div className="text-center animate-fade-in-up">
          <div className="header-card rounded-2xl p-6 shadow-2xl mb-8 transform hover-lift">
            <div className="relative">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2 neon-text">
                Join Us
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse-glow">
                Create your account today
              </p>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-float"></div>
            </div>
          </div>
        </div>

        {/* Main Registration Card */}
        <div className="form-glass rounded-2xl p-8 shadow-2xl transform hover-lift animate-fade-in-up delay-200">
          {/* Registration Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="animate-fade-in-up delay-300">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold light-mode-text mb-2"
                >
                  👤 Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg"
                  placeholder="Enter your full name"
                  disabled={loading}
                />
              </div>

              <div className="animate-fade-in-up delay-400">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold light-mode-text mb-2"
                >
                  📧 Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="animate-fade-in-up delay-500">
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold light-mode-text mb-2"
                >
                  📞 Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={handleInputFocus}
                  className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg"
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>

              <div className="animate-fade-in-up delay-600">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold light-mode-text mb-2"
                >
                  🔒 Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg pr-12"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus-ring"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg transform hover:scale-110">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
                <p className="text-xs light-mode-text-muted mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              <div className="animate-fade-in-up delay-700">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold light-mode-text mb-2"
                >
                  🔒 Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={handleInputFocus}
                    className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg pr-12"
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus-ring"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  >
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg transform hover:scale-110">
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center animate-fade-in-up delay-800">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                required
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 focus-ring"
                disabled={loading}
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 block text-sm light-mode-text"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200 focus-ring rounded"
                >
                  Terms and Conditions
                </Link>
              </label>
            </div>

            <div className="animate-fade-in-up delay-900">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-3 px-4 rounded-xl font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 btn-shine ${getButtonGradient()} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus-ring`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">✨</span>
                    Create your account
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in-up delay-1000">
            <p className="light-mode-text-muted">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200 focus-ring rounded"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 p-4 demo-card rounded-xl border animate-fade-in-up delay-1100">
            <h3 className="text-sm font-semibold light-mode-text mb-3 text-center">
              🎁 Account Benefits
            </h3>
            <div className="text-xs light-mode-text-muted space-y-2">
              <div className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <span className="mr-2">🚚</span>
                <span>Fast checkout & order tracking</span>
              </div>
              <div className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <span className="mr-2">⭐</span>
                <span>Exclusive deals and offers</span>
              </div>
              <div className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <span className="mr-2">💝</span>
                <span>Personalized recommendations</span>
              </div>
              <div className="flex items-center p-2 bg-white dark:bg-gray-700 rounded-lg">
                <span className="mr-2">📦</span>
                <span>Order history and easy reordering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center animate-fade-in-up delay-1200">
          <div className="security-badge rounded-full px-4 py-2 inline-block">
            <p className="text-xs light-mode-text-muted flex items-center justify-center">
              <span className="mr-2">🔒</span>
              Your information is secure and encrypted
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        {isPageLoaded && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full opacity-20 animate-float"></div>
            <div
              className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-blue-400 rounded-full opacity-30 animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-green-300 rounded-full opacity-40 animate-bounce-subtle"></div>
          </>
        )}
      </div>
    </div>
  );
}
