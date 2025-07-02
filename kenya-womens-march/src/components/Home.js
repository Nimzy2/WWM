import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/60 to-background text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
              World March of Women Kenya
            </h1>
            <p className="text-xl md:text-2xl text-text mb-8 mx-auto">
              Empowering women's voices, advocating for equality,
              and building a stronger Kenya
            </p>
            <div className="space-x-4">
              <Link
                to="/join"
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-background transition-colors duration-200"
              >
                Join Our Movement
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ...rest of the Home component... */}
    </div>
  );
};

export default Home; 