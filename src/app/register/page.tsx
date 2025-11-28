import Link from "next/link";

export default function Register() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 theme-accent neon-text">
          Register
        </h1>
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 neon-glow">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-3 theme-accent">
                Full Name
              </label>
              <input
                type="text"
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 theme-accent">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 theme-accent">
                Password
              </label>
              <input
                type="password"
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                placeholder="Create a password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 theme-accent">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                placeholder="Confirm your password"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 theme-accent rounded focus:ring-2 focus:ring-current"
                />
                <span className="text-sm opacity-80">
                  I agree to the{" "}
                  <Link href="/terms" className="theme-accent hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="theme-accent hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="theme-button px-6 py-4 rounded-xl font-semibold w-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Register
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center opacity-80">
              Already have an account?{" "}
              <Link
                href="/login"
                className="theme-accent font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
