export default function Contact() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 theme-accent neon-text">
          Contact Us
        </h1>
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 neon-glow">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 theme-accent">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3 theme-accent">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                  placeholder="Enter your last name"
                />
              </div>
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
                Subject
              </label>
              <input
                type="text"
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg"
                placeholder="Enter the subject"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3 theme-accent">
                Message
              </label>
              <textarea
                rows={5}
                className="w-full bg-white/80 dark:bg-gray-800/80 border-2 border-white/40 rounded-xl px-4 py-4 focus:outline-none focus:border-current focus:ring-2 focus:ring-current transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white backdrop-blur-sm shadow-lg resize-none"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="theme-button px-6 py-4 rounded-xl font-semibold w-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
