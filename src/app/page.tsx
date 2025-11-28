export default function Home() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 theme-accent neon-text">
          Welcome to FoodCart
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Discover delicious meals with our stunning glassmorphism design
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 neon-glow hover:neon-text"
            >
              <h3 className="text-xl font-semibold mb-4 theme-accent">
                Food Item {item}
              </h3>
              <p className="opacity-80 mb-6 leading-relaxed">
                Delicious description that makes your mouth water with
                anticipation.
              </p>
              <button className="theme-button px-6 py-3 rounded-xl font-semibold transition-all duration-300 w-full">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
