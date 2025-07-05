import React, { useEffect, useRef } from 'react';

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

const stats = [
  { label: "Active Members", value: 12000 },
  { label: "Counties Reached", value: 47 },
  { label: "Women Empowered", value: 50000 },
  { label: "Grassroots Projects", value: 150 },
];

const values = [
  {
    title: "Compassion",
    desc: "We approach our mission with empathy, uplifting every woman's story.",
  },
  {
    title: "Integrity",
    desc: "We uphold honesty and transparency in all our actions and partnerships.",
  },
  {
    title: "Inclusivity",
    desc: "We celebrate diversity and ensure every woman's voice is heard.",
  },
  {
    title: "Action",
    desc: "We drive real change through advocacy, education, and community projects.",
  },
];

const About = () => {
  // Animated counters
  const memberRef = useCountUp(stats[0].value);
  const countiesRef = useCountUp(stats[1].value);
  const empoweredRef = useCountUp(stats[2].value);
  const projectsRef = useCountUp(stats[3].value);

  return (
    <div className="min-h-screen bg-[#EBE2F2] py-12 font-sans">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-[#43245A] leading-tight">World March of Women Kenya</h1>
        <p className="text-2xl md:text-3xl text-[#232323] mb-8 font-medium max-w-3xl mx-auto">
          Empowering women. Transforming communities. Shaping Kenya's future.
        </p>
        <div className="text-lg md:text-xl text-[#43245A] font-semibold mb-4">
          "When women rise, Kenya rises."
        </div>
        <p className="text-lg text-[#232323] max-w-2xl mx-auto">
          We are a grassroots movement dedicated to advancing gender equality, amplifying women's voices, and building a just, inclusive society for all Kenyans.
        </p>
      </section>

      {/* Impact Statistics */}
      <section className="max-w-5xl mx-auto mb-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div className="bg-[#B6A8C1] rounded-xl py-8 shadow-md">
          <div ref={memberRef} className="text-4xl md:text-5xl font-bold text-[#43245A] mb-2">0</div>
          <div className="text-lg text-[#232323] font-semibold">{stats[0].label}</div>
        </div>
        <div className="bg-[#B6A8C1] rounded-xl py-8 shadow-md">
          <div ref={countiesRef} className="text-4xl md:text-5xl font-bold text-[#43245A] mb-2">0</div>
          <div className="text-lg text-[#232323] font-semibold">{stats[1].label}</div>
        </div>
        <div className="bg-[#B6A8C1] rounded-xl py-8 shadow-md">
          <div ref={empoweredRef} className="text-4xl md:text-5xl font-bold text-[#43245A] mb-2">0</div>
          <div className="text-lg text-[#232323] font-semibold">{stats[2].label}</div>
        </div>
        <div className="bg-[#B6A8C1] rounded-xl py-8 shadow-md">
          <div ref={projectsRef} className="text-4xl md:text-5xl font-bold text-[#43245A] mb-2">0</div>
          <div className="text-lg text-[#232323] font-semibold">{stats[3].label}</div>
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-6xl mx-auto mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] mb-6">Our Story</h2>
          <p className="text-lg text-[#232323] mb-6 leading-relaxed">
            The World March of Women Kenya was born from the dreams and determination of Kenyan women who refused to be silenced. Since 2020, we have united women from all walks of life—rural and urban, young and old—to demand justice, equality, and opportunity.
          </p>
          <p className="text-lg text-[#232323] mb-6 leading-relaxed">
            In a country where women have long faced barriers to education, healthcare, economic independence, and political participation, our movement stands as a beacon of hope. We believe that when women are empowered, families prosper, communities flourish, and the nation advances.
          </p>
          <p className="text-lg text-[#232323] leading-relaxed">
            Our journey is one of courage, resilience, and solidarity. Together, we are rewriting the story of Kenyan women—one of leadership, innovation, and unstoppable progress.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" alt="Kenyan women" className="rounded-2xl shadow-lg mb-6 w-full max-w-xs" />
          <div className="text-[#43245A] text-lg font-semibold">"Empowered women empower Kenya."</div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] text-center mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={i} className="bg-[#43245A] rounded-xl p-8 text-center shadow-md">
              <div className="w-16 h-16 bg-[#B6A8C1] rounded-full flex items-center justify-center mx-auto mb-4">
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
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-[#EBE2F2]">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      {/* Timeline section removed as per instructions */}

      {/* Leadership Team */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl md:text-4xl font-bold text-[#43245A] text-center mb-12">Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {leadership.map((leader, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
              <img src={leader.img} alt={leader.name} className="w-28 h-28 rounded-full mb-4 border-4 border-[#B6A8C1] object-cover" />
              <h3 className="text-xl font-bold text-[#43245A] mb-1">{leader.name}</h3>
              <div className="text-[#B6A8C1] font-semibold mb-2">{leader.role}</div>
              <p className="text-[#232323] text-center text-sm">{leader.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inspiring Closing */}
      <section className="max-w-3xl mx-auto text-center mt-16 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#43245A] mb-4">Together, We Rise</h2>
        <p className="text-lg text-[#232323] mb-4">
          Every day, Kenyan women are breaking barriers, leading change, and inspiring generations. Join us as we march forward—empowering women, transforming Kenya.
        </p>
      </section>
    </div>
  );
};

export default About; 