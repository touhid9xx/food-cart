/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { loginUser } from "../lib/slices/authSlice";
import { useAlert } from "../lib/hooks/useAlert";
import { authApi } from "../lib/api/authApi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState<
    Array<{ email: string; role: string; password: string }>
  >([]);
  const [isLoadingDemo, setIsLoadingDemo] = useState<string | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const dispatch = useAppDispatch();
  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { success, error, info, clear } = useAlert();
  const router = useRouter();

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      success("Welcome back! Redirecting...", "Success", 2000);
      setTimeout(() => {
        router.push("/");
      }, 1500);
    }
  }, [isAuthenticated, router, success]);

  // Load demo accounts from API on component mount
  useEffect(() => {
    const loadDemoAccounts = async () => {
      try {
        const response = await authApi.getDemoAccounts();
        if (response.success) {
          setDemoAccounts(response.data);
          setTimeout(() => {
            info(
              "Demo accounts loaded. Click any demo button to login quickly.",
              "Quick Access"
            );
          }, 500);
        }
      } catch (err) {
        console.error("Failed to load demo accounts");
        error("Failed to load demo accounts", "Error");
      }
    };

    loadDemoAccounts();
  }, [info, error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clear();

    if (!email || !password) {
      error("Please fill in all fields", "Missing Information");
      return;
    }

    if (!validateEmail(email)) {
      error("Please enter a valid email address", "Invalid Email");
      return;
    }

    try {
      info("Authenticating your credentials...", "Signing In");
      const result = await dispatch(loginUser({ email, password })).unwrap();

      if (rememberMe) {
        success(
          `Welcome back, ${result.user?.name || "User"}! Session saved.`,
          "Login Successful"
        );
      } else {
        success(
          `Welcome back, ${result.user?.name || "User"}!`,
          "Login Successful"
        );
      }
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err ||
        "Login failed. Please try again.";
      error(errorMessage, "Login Failed");
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDemoLogin = async (role: "customer" | "admin") => {
    clear();
    const account = demoAccounts.find((acc) => acc.role === role);
    if (account) {
      setIsLoadingDemo(role);
      setEmail(account.email);
      setPassword(account.password);

      info(`Logging in as demo ${role}...`, "Quick Login");

      setTimeout(async () => {
        try {
          const result = await dispatch(
            loginUser({ email: account.email, password: account.password })
          ).unwrap();

          success(
            `Demo ${role} login successful! Welcome, ${
              result.user?.name || "User"
            }!`,
            "Welcome!"
          );
        } catch (err: any) {
          const errorMessage =
            err?.response?.data?.message || "Demo login failed";
          error(errorMessage, "Login Error");
        } finally {
          setIsLoadingDemo(null);
        }
      }, 800);
    } else {
      error("Demo account not found", "Error");
      setIsLoadingDemo(null);
    }
  };

  const handleInputFocus = () => {
    clear();
  };

  const getThemeGradient = () => {
    return "bg-gradient-to-br from-blue-50/80 via-white/90 to-purple-50/80 dark:from-blue-900/20 dark:via-gray-900 dark:to-purple-900/20";
  };

  const getButtonGradient = (role?: string) => {
    if (role === "admin") {
      return "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25";
    }
    if (role === "customer") {
      return "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25";
    }
    return "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25";
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 neon-text">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg animate-pulse-glow">
                Sign in to your account
              </p>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-float"></div>
            </div>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="form-glass rounded-2xl p-8 shadow-2xl transform hover-lift animate-fade-in-up delay-200">
          {/* Demo Login Buttons */}
          {demoAccounts.length > 0 && (
            <>
              <div className="mb-6 animate-fade-in-up delay-300">
                <h3 className="text-sm font-semibold light-mode-text mb-3 text-center">
                  🚀 Quick Demo Access
                </h3>
                <div className="space-y-3">
                  {demoAccounts.map((account, index) => (
                    <button
                      key={account.role}
                      onClick={() =>
                        handleDemoLogin(account.role as "customer" | "admin")
                      }
                      disabled={loading || isLoadingDemo !== null}
                      className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 font-medium transform hover:scale-105 active:scale-95 btn-shine ${getButtonGradient(
                        account.role
                      )} border-transparent text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-fade-in-up`}
                      style={{ animationDelay: `${400 + index * 100}ms` }}
                    >
                      {isLoadingDemo === account.role ? (
                        <span className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Logging in...
                        </span>
                      ) : (
                        `Demo ${
                          account.role.charAt(0).toUpperCase() +
                          account.role.slice(1)
                        } Login`
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative my-8 animate-fade-in-up delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t divider-line"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 form-glass rounded-full light-mode-text-muted font-medium">
                    Or sign in with credentials
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Login Form */}
          <form
            className="space-y-6 animate-fade-in-up delay-600"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4">
              <div className="animate-fade-in-up delay-700">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleInputFocus}
                  className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg"
                  placeholder="Enter your email"
                  disabled={loading || isLoadingDemo !== null}
                />
              </div>

              <div className="animate-fade-in-up delay-800">
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    className="w-full input-enhanced rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/20 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 focus:transform focus:translate-y-[-2px] focus:shadow-lg pr-12"
                    placeholder="Enter your password"
                    disabled={loading || isLoadingDemo !== null}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center focus-ring"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading || isLoadingDemo !== null}
                  >
                    <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors text-lg transform hover:scale-110">
                      {showPassword ? "🙈" : "👁️"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between animate-fade-in-up delay-900">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 focus-ring"
                  disabled={loading || isLoadingDemo !== null}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm light-mode-text font-medium"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 focus-ring rounded"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up delay-1000">
              <button
                type="submit"
                disabled={loading || isLoadingDemo !== null}
                className={`w-full text-white py-3 px-4 rounded-xl font-semibold transform hover:scale-105 active:scale-95 transition-all duration-300 btn-shine ${getButtonGradient()} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus-ring`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">🎯</span>
                    Sign in to your account
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center animate-fade-in-up delay-1100">
            <p className="light-mode-text-muted">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200 focus-ring rounded"
              >
                Create one now
              </Link>
            </p>
          </div>

          {/* Demo Accounts Info */}
          {demoAccounts.length > 0 && (
            <div className="mt-8 p-4 demo-card rounded-xl border animate-fade-in-up delay-1200">
              <h3 className="text-sm font-semibold light-mode-text mb-3 text-center">
                📋 Demo Accounts Credentials
              </h3>
              <div className="text-xs light-mode-text-muted space-y-2">
                {demoAccounts.map((account) => (
                  <div
                    key={account.role}
                    className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200"
                  >
                    <span className="font-medium capitalize theme-accent">
                      {account.role}:
                    </span>
                    <div className="text-right">
                      <div className="font-mono text-gray-800 dark:text-gray-200">
                        {account.email}
                      </div>
                      <div className="font-mono text-gray-500 dark:text-gray-400">
                        {account.password}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs light-mode-text-muted text-center mt-3">
                Click demo buttons above for quick login
              </p>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="text-center animate-fade-in-up delay-1300">
          <div className="security-badge rounded-full px-4 py-2 inline-block">
            <p className="text-xs light-mode-text-muted flex items-center justify-center">
              <span className="mr-2">🔒</span>
              Your login information is secure and encrypted
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        {isPageLoaded && (
          <>
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-float"></div>
            <div
              className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-purple-400 rounded-full opacity-30 animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-bounce-subtle"></div>
          </>
        )}
      </div>
    </div>
  );
}
