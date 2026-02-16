import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import SEOHead from './SEOHead';
import image7 from '../wwmk_images/image7.jpeg';
import image8 from '../wwmk_images/image8.jpeg';
import image10 from '../wwmk_images/image10.jpeg';
import image12 from '../wwmk_images/image12.jpeg';
import wmk2 from '../wwmk_images/wmk2.jpg';
import wmk3 from '../wwmk_images/wmk3.jpg';
import wmk4 from '../wwmk_images/wmk4.jpg';
import wmk5 from '../wwmk_images/wmk5.jpg';
import wmk6 from '../wwmk_images/wmk6.jpg';
import wmk7 from '../wwmk_images/wmk7.jpg';
import wmk8 from '../wwmk_images/wmk8.jpg';
import wmk9 from '../wwmk_images/wmk9.jpg';
import wmk10 from '../wwmk_images/wmk10.jpg';
import wmk11 from '../wwmk_images/wmk11.jpg';
import wmk12 from '../wwmk_images/wmk12.jpg';
import wmk13 from '../wwmk_images/wmk13.jpg';
import wmk14 from '../wwmk_images/wmk14.jpg';
import wmk15 from '../wwmk_images/wmk15.jpg';

// Helper for animated counters
const useCountUp = (end, duration = 2000) => {
  const ref = useRef();
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    let current = start;
    const step = () => {
      current += increment;
      if (current < end) {
        ref.current.innerText = Math.floor(current).toLocaleString();
        requestAnimationFrame(step);
      } else {
        ref.current.innerText = end.toLocaleString();
      }
    };
    step();
  }, [end, duration]);
  return ref;
};

const values = [
  {
    title: "Solidarity",
    desc: "We stand with all oppressed people locally and globally. Our struggles are interconnected, and we believe in showing up for one another across borders, identities, and movements.",
  },
  {
    title: "Feminist Leadership",
    desc: "We organize from a place of care, resistance, and collective power. Our feminism is inclusive, anti-patriarchal, and rooted in the lived experiences of women and gender-diverse people.",
  },
  {
    title: "Grassroots Power",
    desc: "We believe real change starts at the community level. We center the knowledge, leadership, and organizing of those most affected by injustice because the people closest to the problem hold the solutions.",
  },
  {
    title: "Popular Education",
    desc: "We are committed to learning together. Through collective study and reflection, we deepen our political understanding and sharpen our tools for resistance and transformation.",
  },
  {
    title: "Anti-Capitalist Justice",
    desc: "We reject systems that exploit, divide, and dehumanize. We organize for a world where resources are shared, dignity is protected, and no one is disposable.",
  },
];

const storyImages = [
  image7, 
  image8, 
  image10, 
  image12,
  wmk2,
  wmk3,
  wmk4,
  wmk5,
  wmk6,
  wmk7,
  wmk8,
  wmk9,
  wmk10,
  wmk11,
  wmk12,
  wmk13,
  wmk14,
  wmk15
];

const About = () => {
  // Fetch stats from Supabase
  const [stats, setStats] = useState([
    { label: 'Active Members', value: 0 },
    { label: 'Counties Reached', value: 0 },
    { label: 'Women Empowered', value: 0 },
    { label: 'Grassroots Projects', value: 0 },
  ]);

  // State for expanded value cards
  const [expanded, setExpanded] = useState(Array(values.length).fill(false));
  const toggleExpand = idx => {
    setExpanded(expanded => expanded.map((v, i) => i === idx ? !v : v));
  };

  // Carousel state for story images
  const [currentImage, setCurrentImage] = useState(0);

  // Gallery state for bottom image gallery
  const [galleryImage, setGalleryImage] = useState(0);
  const handleGalleryPrev = () => {
    setGalleryImage((prev) => (prev === 0 ? storyImages.length - 1 : prev - 1));
  };
  const handleGalleryNext = () => {
    setGalleryImage((prev) => (prev === storyImages.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance carousel every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === storyImages.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*');
      if (!error && data) {
        // Sort to match the display order if needed
        const order = [
          'Active Members',
          'Counties Reached',
          'Women Empowered',
          'Grassroots Projects',
        ];
        const sorted = order.map(label => data.find(s => s.label === label) || { label, value: 0 });
        setStats(sorted);
      }
    }
    fetchStats();
  }, []);

  // Animated counters
  const memberRef = useCountUp(stats[0].value);
  const countiesRef = useCountUp(stats[1].value);
  const empoweredRef = useCountUp(stats[2].value);
  const projectsRef = useCountUp(stats[3].value);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <SEOHead 
        title="About Us"
        description="Learn about World March of Women Kenya's mission to empower women, transform communities, and shape Kenya's future through grassroots mobilization and feminist leadership."
        keywords="about WMW Kenya, women's movement Kenya, feminist leadership, grassroots mobilization, women's rights advocacy, community transformation, gender equality Kenya"
      />
      
      {/* Hero Section - Modern Gradient with Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={storyImages[currentImage]}
            alt={`Story ${currentImage + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#43245A]/95 via-[#43245A]/90 to-[#43245A]/85"></div>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3 z-20">
          {storyImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImage(idx)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                idx === currentImage ? 'bg-white w-6 sm:w-8' : 'bg-white/50 hover:bg-white/75 w-2 sm:w-3'
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 text-white">
          <div className="max-w-3xl">
            <div className="inline-block mb-4 sm:mb-6">
              <span className="text-xs sm:text-sm md:text-base font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
                About Us
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight">
              World March of Women Kenya
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">
              <span className="block text-purple-200">Feminists</span>
              <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                Across Borders,
              </span>
              <span className="block text-purple-100">Not Just Sharing Stories</span>
              <span className="block bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                But Building Strategies
              </span>
              <span className="block text-purple-200">To Transform The World</span>
            </p>
            <p className="text-lg sm:text-xl md:text-2xl italic font-medium mb-6 sm:mb-8 text-purple-100">
              "When women rise, Kenya rises."
            </p>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-100 max-w-2xl">
              We are a grassroots movement dedicated to advancing gender equality, amplifying women's voices, and building a just, inclusive society for all Kenyans.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Statistics - Modern Cards */}
      <section className="relative -mt-8 sm:-mt-12 md:-mt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <div 
                key={stat.label} 
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100"
              >
                <div 
                  ref={[memberRef, countiesRef, empoweredRef, projectsRef][i]} 
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#43245A] to-[#B6A8C1] bg-clip-text text-transparent mb-2 sm:mb-3"
                >
                  0
                </div>
                <div className="text-xs sm:text-sm md:text-base text-gray-600 font-semibold leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section - Modern Layout */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
            {/* Image Gallery */}
            <div className="relative order-2 lg:order-1">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl aspect-[4/3] group">
                <img
                  src={storyImages[galleryImage]}
                  alt="Our work"
                  className="w-full h-full object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Navigation Arrows */}
                <button
                  onClick={handleGalleryPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#43245A] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleGalleryNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#43245A] p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Text Content */}
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <div>
                <span className="text-xs sm:text-sm font-semibold text-[#B6A8C1] uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-4 sm:mb-6">
                  Building a Movement Since 2007
                </h2>
              </div>
              
              <div className="space-y-4 sm:space-y-5 text-gray-700 text-base sm:text-lg leading-relaxed">
                <p>
                  <span className="font-bold text-[#43245A]">Since 2007</span>, World March of Women Kenya has been a home for women who refuse to accept injustice as fate. Born under the banner of the <span className="font-semibold text-[#B6A8C1]">Feminist Organizing School Africa</span>, our movement brings together Kenyan women from across the country–urban and rural, young and old, queer and cisgender, workers and mothers into a shared commitment: to organize against patriarchy, capitalism, and all forms of oppression.
                </p>
                <p>
                  We believe that <span className="font-semibold text-[#43245A]">women's liberation is inseparable from the liberation of all oppressed people</span>. Our work spans from grassroots community organizing to national policy advocacy, always centering the voices and leadership of those most affected by injustice.
                </p>
                <p>
                  Through popular education, direct action, and solidarity building, we're creating a Kenya where every woman can live with dignity, safety, and the power to shape her own destiny.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Quote Section - Full Width */}
      <section className="py-10 sm:py-12 md:py-16 bg-[#43245A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <blockquote className="text-lg sm:text-xl md:text-2xl italic font-semibold text-white text-center leading-relaxed">
            "They are not weak—they are weary. But with us, they do not find charity. They find solidarity."
          </blockquote>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-gradient-to-br from-gray-50 via-white to-purple-50" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 id="team-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 text-center tracking-tight">
              Meet Our Team
            </h2>
            <div className="w-12 h-1 sm:w-16 sm:h-0.5 bg-[#43245A] mx-auto mt-4 rounded-full opacity-90" aria-hidden="true" />
          </header>

          {/* Subsection: Working Team */}
          <div className="mb-16 sm:mb-20 md:mb-24">
            <h3 className="text-xs sm:text-sm font-semibold text-[#B6A8C1] uppercase tracking-[0.25em] text-center mb-8 sm:mb-10 md:mb-12">
              Working Team
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
              {[
                'Sophie Ogutu',
                'Beatrice Kamau',
                'Anne Wanjiru',
                'Esther Mwakali',
                'Millicent Awino',
                'Michelle Kabucho',
                'Terry Ochola',
                'Lydia Dola',
                'Regina Mutiru',
                'Comfort Achieng'
              ].map((name, idx) => (
                <div
                  key={name}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-[#B6A8C1]/30"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Profile Photo */}
                  <div className="relative mb-4 sm:mb-5">
                    <div className="relative w-full aspect-square rounded-full sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#B6A8C1]/20 to-[#43245A]/10 group-hover:from-[#B6A8C1]/30 group-hover:to-[#43245A]/20 transition-all duration-500">
                      <img
                        src={`/team/${name === 'Anne Wanjiru' ? 'anne-wanjiku' : name.toLowerCase().replace(/\s+/g, '-')}.jpeg`}
                        alt={name}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${name === 'Millicent Awino' ? 'object-top' : ''}`}
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23B6A8C1'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%2343245A' text-anchor='middle' dy='.3em'%3E${name.split(' ').map(n => n[0]).join('')}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent group-hover:from-black/10 transition-all duration-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full sm:rounded-2xl bg-[#B6A8C1]/0 group-hover:bg-[#B6A8C1]/10 blur-xl transition-all duration-500 -z-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-[#43245A] transition-colors duration-300 leading-tight">
                      {name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full border-t border-gray-200 mb-16 sm:mb-20 md:mb-24" />

          {/* Subsection: Our Secretariat */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#B6A8C1] uppercase tracking-[0.25em] text-center mb-8 sm:mb-10 md:mb-12">
              Our Secretariat
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10 max-w-4xl mx-auto">
              {[
                'Sophie Ogutu',
                'Michelle Kabucho',
                'Anne Wanjiku'
              ].map((name, idx) => (
                <div
                  key={name}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 hover:border-[#B6A8C1]/30"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative mb-5 sm:mb-6">
                    <div className="relative w-full aspect-square rounded-full sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#B6A8C1]/20 to-[#43245A]/10 group-hover:from-[#B6A8C1]/30 group-hover:to-[#43245A]/20 transition-all duration-500">
                      <img
                        src={`/team/${name.toLowerCase().replace(/\s+/g, '-')}.jpeg`}
                        alt={name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23B6A8C1'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%2343245A' text-anchor='middle' dy='.3em'%3E${name.split(' ').map(n => n[0]).join('')}%3C/text%3E%3C/svg%3E`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent group-hover:from-black/10 transition-all duration-500" />
                    </div>
                    <div className="absolute inset-0 rounded-full sm:rounded-2xl bg-[#B6A8C1]/0 group-hover:bg-[#B6A8C1]/10 blur-xl transition-all duration-500 -z-10" />
                  </div>
                  <div className="text-center">
                    <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 group-hover:text-[#43245A] transition-colors duration-300 leading-tight">
                      {name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values - Modern Grid */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <span className="text-xs sm:text-sm font-semibold text-[#B6A8C1] uppercase tracking-wider">Our Foundation</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mt-2">
              Our Values
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-2xl mx-auto px-4">
              The principles that guide our work and shape our movement
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, idx) => (
              <div
                key={value.title}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#B6A8C1]/50 hover:-translate-y-1"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#43245A] transition-colors pr-2">
                    {value.title}
                  </h3>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#B6A8C1] to-[#43245A] flex items-center justify-center text-white font-bold text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {idx + 1}
                  </div>
                </div>
                <p className={`text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-300 ${
                  expanded[idx] ? 'line-clamp-none' : 'line-clamp-4'
                }`}>
                  {value.desc}
                </p>
                <button className="mt-3 sm:mt-4 text-[#43245A] hover:text-[#B6A8C1] font-semibold text-xs sm:text-sm transition-colors duration-200 flex items-center gap-2 group">
                  {expanded[idx] ? 'Show Less' : 'Read More'}
                  <svg className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${expanded[idx] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 