import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';
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
    <div className="min-h-screen py-12 font-sans bg-gradient-to-br from-[#EBE2F2] via-[#F8F4FC] to-[#B6A8C1] animate-gradient-slow relative overflow-x-hidden">
      {/* Animated Wavy Divider Top */}
      <div className="absolute top-0 left-0 w-full -z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-24">
          <path fill="#B6A8C1" fillOpacity="0.25" d="M0,64L48,74.7C96,85,192,107,288,117.3C384,128,480,128,576,117.3C672,107,768,85,864,74.7C960,64,1056,64,1152,80C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
      </div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#43245A] via-[#B6A8C1] to-[#43245A] animate-fade-in-up drop-shadow-lg tracking-tight">World March of Women Kenya</h1>
        <p className="text-2xl md:text-3xl text-[#232323] mb-8 font-medium max-w-3xl mx-auto animate-fade-in-up delay-100">
          Empowering women. Transforming communities. Shaping Kenya's future.
        </p>
        <div className="text-lg md:text-xl text-[#43245A] font-semibold mb-4 italic animate-fade-in-up delay-200">
          "When women rise, Kenya rises."
        </div>
        <p className="text-lg text-[#232323] max-w-2xl mx-auto animate-fade-in-up delay-300">
          We are a grassroots movement dedicated to advancing gender equality, amplifying women's voices, and building a just, inclusive society for all Kenyans.
        </p>
      </section>
      {/* Impact Statistics */}
      <section className="max-w-5xl mx-auto mb-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={stat.label} className="bg-[#B6A8C1] rounded-xl py-8 shadow-md animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div ref={[memberRef, countiesRef, empoweredRef, projectsRef][i]} className="text-4xl md:text-5xl font-bold text-[#43245A] mb-2">0</div>
            <div className="text-lg text-[#232323] font-semibold">{stat.label}</div>
          </div>
        ))}
      </section>
      {/* Wavy Divider */}
      <div className="w-full -mb-8">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path fill="#B6A8C1" fillOpacity="0.18" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,37.3C960,32,1056,32,1152,40C1248,48,1344,64,1392,72L1440,80L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
        </svg>
      </div>
      {/* Our Story */}
      <section className="max-w-6xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] mb-6 animate-fade-in-up">Our Story</h2>
          <p className="text-lg text-[#232323] mb-6 leading-relaxed animate-fade-in-up delay-100">
            The World March of Women Kenya was born from the dreams and determination of Kenyan women who refused to be silenced. Since 2020, we have united women from all walks of life—rural and urban, young and old—to demand justice, equality, and opportunity.
          </p>
          <p className="text-lg text-[#232323] mb-6 leading-relaxed animate-fade-in-up delay-200">
            In a country where women have long faced barriers to education, healthcare, economic independence, and political participation, our movement stands as a beacon of hope. We believe that when women are empowered, families prosper, communities flourish, and the nation advances.
          </p>
          <p className="text-lg text-[#232323] leading-relaxed animate-fade-in-up delay-300">
            Our journey is one of courage, resilience, and solidarity. Together, we are rewriting the story of Kenyan women—one of leadership, innovation, and unstoppable progress.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center animate-fade-in-up delay-200">
          <div className="relative w-80 h-80 flex items-center justify-center group">
            <img
              src={storyImages[currentImage]}
              alt={`Kenyan women ${currentImage + 1}`}
              className="rounded-xl shadow-lg w-80 h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#43245A] text-white rounded-full p-2 shadow hover:bg-[#B6A8C1] transition"
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#43245A] text-white rounded-full p-2 shadow hover:bg-[#B6A8C1] transition"
              aria-label="Next"
            >
              &#8594;
            </button>
          </div>
          <div className="text-[#43245A] text-lg font-semibold mt-4 italic animate-fade-in-up delay-300">"Empowered women empower Kenya."</div>
        </div>
      </section>
      {/* Core Values */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] text-center mb-12 animate-fade-in-up">Our Core Values</h2>
        <div className="flex flex-row flex-wrap items-stretch justify-center gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-[#43245A] rounded-2xl p-8 text-center shadow-xl transition-all duration-300 ease-in-out w-72 flex flex-col hover:scale-105 hover:shadow-2xl hover:bg-[#5c357a] group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 bg-[#B6A8C1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform duration-300">
                {i === 0 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                )}
                {i === 1 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                )}
                {i === 2 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                )}
                {i === 3 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )}
                {i === 4 && (
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v2m0 0c0 2.5-2 4.5-4.5 4.5S3 7.5 3 5m9 0c0 2.5 2 4.5 4.5 4.5S21 7.5 21 5m-9 0v13m0 0h6m-6 0H6m3 0v2a1 1 0 001 1h2a1 1 0 001-1v-2" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2 tracking-wide drop-shadow">{v.title}</h3>
              <p className="text-[#EBE2F2] leading-relaxed font-medium">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] text-center mb-12 animate-fade-in-up">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {leadership.map((leader, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-28 h-28 rounded-full mb-4 border-4 border-gradient-to-tr from-[#B6A8C1] via-[#43245A] to-[#B6A8C1] p-1" style={{ background: 'linear-gradient(135deg, #B6A8C1, #43245A 60%, #B6A8C1)' }}>
                <img src={leader.img} alt={leader.name} className="w-full h-full rounded-full object-cover border-4 border-white" />
              </div>
              <h3 className="text-xl font-bold text-[#43245A] mb-1 tracking-wide">{leader.name}</h3>
              <div className="text-[#B6A8C1] font-semibold mb-2">{leader.role}</div>
              <p className="text-[#232323] text-center text-sm leading-relaxed">{leader.bio}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Inspiring Closing */}
      <section className="max-w-3xl mx-auto text-center mt-16 mb-8 animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-[#43245A] mb-4">Together, We Rise</h2>
        <p className="text-lg text-[#232323] mb-4">
          Every day, Kenyan women are breaking barriers, leading change, and inspiring generations. Join us as we march forward—empowering women, transforming Kenya.
        </p>
      </section>
    </div>
  );
};

export default About; 