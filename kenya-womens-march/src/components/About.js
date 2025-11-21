import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
import SEOHead from './SEOHead';
import image0 from '../wwmk_images/image0.jpeg';
import image1 from '../wwmk_images/image1.jpeg';
import image7 from '../wwmk_images/image7.jpeg';
import image8 from '../wwmk_images/image8.jpeg';
import image10 from '../wwmk_images/image10.jpeg';
import image12 from '../wwmk_images/image12.jpeg';

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

const leadership = [
  {
    name: "Amina Ochieng",
    role: "Executive Director",
    bio: "Visionary leader with 15+ years championing women's rights and social justice in Kenya.",
    img: 'https://ui-avatars.com/api/?name=Amina+Ochieng&background=B6A8C1&color=43245A&size=128',
  },
  {
    name: "Sarah Muthoni",
    role: "Programs Coordinator",
    bio: "Expert in grassroots mobilization and community empowerment across all 47 counties.",
    img: 'https://ui-avatars.com/api/?name=Sarah+Muthoni&background=B6A8C1&color=43245A&size=128',
  },
  {
    name: "Fatima Hassan",
    role: "Advocacy Director",
    bio: "Leads policy initiatives, amplifying women's voices in government and society.",
    img: 'https://ui-avatars.com/api/?name=Fatima+Hassan&background=B6A8C1&color=43245A&size=128',
  },
  {
    name: "Grace Wanjiru",
    role: "Finance Lead",
    bio: "Ensures sustainable growth and transparency in all our financial operations.",
    img: 'https://ui-avatars.com/api/?name=Grace+Wanjiru&background=B6A8C1&color=43245A&size=128',
  },
  {
    name: "Janet Otieno",
    role: "Communications Manager",
    bio: "Drives our message of empowerment through media and public engagement.",
    img: 'https://ui-avatars.com/api/?name=Janet+Otieno&background=B6A8C1&color=43245A&size=128',
  },
  {
    name: "Linet Njeri",
    role: "Youth Engagement Officer",
    bio: "Inspires and mentors the next generation of women leaders in Kenya.",
    img: 'https://ui-avatars.com/api/?name=Linet+Njeri&background=B6A8C1&color=43245A&size=128',
  },
];

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

const storyImages = [image0, image1, image7, image8, image10, image12];

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
  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? storyImages.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setCurrentImage((prev) => (prev === storyImages.length - 1 ? 0 : prev + 1));
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
            alt={`Story image ${currentImage + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#43245A]/95 via-[#43245A]/90 to-[#43245A]/85"></div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 z-20 group"
          aria-label="Previous image"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 md:p-4 rounded-full shadow-xl transition-all duration-300 z-20 group"
          aria-label="Next image"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

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
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-purple-200">
              Empowering women. Transforming communities. Shaping Kenya's future.
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
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl aspect-[4/3]">
                <img
                  src={storyImages[(currentImage + 1) % storyImages.length]}
                  alt="Our work"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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
                  <span className="font-bold text-[#43245A]">Since 2007</span>, WMW-Kenya has been a home for women who refuse to accept injustice as fate. Born under the banner of the <span className="font-semibold text-[#B6A8C1]">Feminist Organizing School Africa</span>, our movement brings together Kenyan women from across the country–urban and rural, young and old, queer and cisgender, workers and mothers into a shared commitment: to organize against patriarchy, capitalism, and all forms of oppression.
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