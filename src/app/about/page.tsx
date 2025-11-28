export default function About() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 theme-accent neon-text">
          About Us
        </h1>
        <div className="glassmorphism rounded-2xl p-8 backdrop-blur-lg border border-white/30 neon-glow">
          <p className="text-lg opacity-80 leading-relaxed mb-6">
            Welcome to FoodCart, your premier destination for delicious meals
            delivered right to your doorstep.
          </p>
          <p className="text-lg opacity-80 leading-relaxed">
            We are committed to providing the best food experience with our
            stunning glassmorphism design and seamless ordering process.
          </p>
        </div>
      </div>
    </section>
  );
}
