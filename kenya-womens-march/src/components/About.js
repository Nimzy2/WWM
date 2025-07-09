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
    <div className="min-h-screen py-8 md:py-12 font-sans bg-gradient-to-br from-[#EBE2F2] via-[#F8F4FC] to-[#B6A8C1] animate-gradient-slow relative overflow-x-hidden">
      <SEOHead 
        title="About Us"
        description="Learn about World March of Women Kenya's mission to empower women, transform communities, and shape Kenya's future through grassroots mobilization and feminist leadership."
        keywords="about WMW Kenya, women's movement Kenya, feminist leadership, grassroots mobilization, women's rights advocacy, community transformation, gender equality Kenya"
      />
      
      {/* Animated Wavy Divider Top */}
      <div className="absolute top-0 left-0 w-full -z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path fill="#B6A8C1" fillOpacity="0.25" d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,117.3C672,107,768,85,864,74.7C960,64,1056,64,1152,80C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
      </div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center mb-12 md:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#43245A] via-[#B6A8C1] to-[#43245A] animate-fade-in-up drop-shadow-lg tracking-tight">World March of Women Kenya</h1>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#232323] mb-6 md:mb-8 font-medium max-w-3xl mx-auto animate-fade-in-up delay-100">
          Empowering women. Transforming communities. Shaping Kenya's future.
        </p>
        <div className="text-base sm:text-lg md:text-xl text-[#43245A] font-semibold mb-3 md:mb-4 italic animate-fade-in-up delay-200">
          "When women rise, Kenya rises."
        </div>
        <p className="text-sm sm:text-base md:text-lg text-[#232323] max-w-2xl mx-auto animate-fade-in-up delay-300 leading-relaxed">
          We are a grassroots movement dedicated to advancing gender equality, amplifying women's voices, and building a just, inclusive society for all Kenyans.
        </p>
      </section>
      {/* Impact Statistics */}
      <section className="max-w-5xl mx-auto mb-16 md:mb-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center px-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-[#B6A8C1] rounded-xl py-6 md:py-8 shadow-md animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div ref={[memberRef, countiesRef, empoweredRef, projectsRef][i]} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#43245A] mb-2">0</div>
            <div className="text-sm sm:text-base md:text-lg text-[#232323] font-semibold">{stat.label}</div>
          </div>
        ))}
      </section>
      {/* Wavy Divider */}
      <div className="w-full -mb-6 md:-mb-8">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 md:h-16">
          <path fill="#B6A8C1" fillOpacity="0.18" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,37.3C960,32,1056,32,1152,40C1248,48,1344,64,1392,72L1440,80L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
      </div>
      {/* Our Story */}
      <section className="relative max-w-6xl mx-auto mb-16 md:mb-20 flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-16 pt-6 md:pt-8 px-4">
        {/* Text Card */}
        <div className="relative bg-gradient-to-br from-white/80 via-[#F8F4FC]/80 to-[#B6A8C1]/60 backdrop-blur-lg border border-[#B6A8C1]/30 rounded-3xl shadow-xl p-6 md:p-8 lg:p-12 flex-1 z-10 mt-6 md:mt-0">
          <div className="absolute -top-4 md:-top-6 left-6 md:left-8 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#B6A8C1] to-[#43245A] rounded-full shadow-lg"></div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#43245A] mb-3 md:mb-4">Our Story</h2>
          <blockquote className="italic text-base sm:text-lg text-[#5c357a] font-semibold mb-3 md:mb-4 border-l-4 border-[#B6A8C1] pl-3 md:pl-4">
            "They are not weak—they are weary. But with us, they do not find charity. They find solidarity."
          </blockquote>
          <div className="space-y-3 md:space-y-4 text-[#232323] text-sm sm:text-base md:text-lg leading-relaxed">
            <p>
              <span className="font-bold text-[#43245A]">Since 2007</span>, WMW-Kenya has been a home for women who refuse to accept injustice as fate. Born under the banner of the <span className="font-semibold text-[#B6A8C1]">Feminist Organizing School Africa</span>, our movement brings together Kenyan women from across the country—urban and rural, young and old, queer and cisgender, workers and mothers—into a shared commitment: to organize against patriarchy, capitalism, and all forms of oppression.
            </p>
            <p>
              We believe that <span className="font-semibold text-[#43245A]">women's liberation is inseparable from the liberation of all oppressed people</span>. Our work spans from grassroots community organizing to national policy advocacy, always centering the voices and leadership of those most affected by injustice.
            </p>
            <p>
              Through popular education, direct action, and solidarity building, we're creating a Kenya where every woman can live with dignity, safety, and the power to shape her own destiny.
            </p>
          </div>
        </div>

        {/* Image Carousel */}
        <div className="relative w-full max-w-md lg:max-w-lg flex-1">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={storyImages[currentImage]}
              alt={`Story image ${currentImage + 1}`}
              className="w-full h-64 sm:h-80 md:h-96 object-cover transition-opacity duration-500"
            />
            {/* Navigation Buttons */}
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-all duration-200"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-lg transition-all duration-200"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {storyImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    idx === currentImage ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="max-w-6xl mx-auto mb-16 md:mb-20 px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#43245A] text-center mb-8 md:mb-12 animate-fade-in">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {values.map((value, idx) => (
            <div
              key={value.title}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => toggleExpand(idx)}
            >
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#43245A] mb-3 md:mb-4">{value.title}</h3>
              <p className={`text-sm sm:text-base text-[#232323] leading-relaxed transition-all duration-300 ${
                expanded[idx] ? 'line-clamp-none' : 'line-clamp-3'
              }`}>
                {value.desc}
              </p>
              <button className="mt-3 text-[#B6A8C1] hover:text-[#43245A] font-semibold text-sm transition-colors duration-200">
                {expanded[idx] ? 'Show Less' : 'Read More'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Team */}
      {/* 'Our Leadership' section removed */}
    </div>
  );
};

export default About; 