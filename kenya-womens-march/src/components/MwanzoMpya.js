import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import SEOHead from './SEOHead';
import styles from './MwanzoMpya.module.css';

const pillars = [
  {
    title: 'Peace',
    description:
      'More than the absence of conflict — the presence of justice, dignity, equality, safety, and freedom. We work toward it through dialogue, collective action, feminist leadership, and community resilience.',
  },
  {
    title: 'Solidarity',
    description:
      'The web that connects all our work — relationships across communities, generations, movements, and borders, particularly within Africa.',
  },
  {
    title: 'Agroecology as feminist alternative',
    description:
      'Food sovereignty, ecological sustainability, traditional and community knowledge, care for the earth, and dignified livelihoods.',
  },
  {
    title: 'Collaboration',
    description:
      'Partnership with allied organizations, community-based organizations, human rights defenders, farmers, and activists — exchanging knowledge together.',
  },
  {
    title: 'An inclusive movement',
    description:
      'Bringing together people across generations, backgrounds, and identities — grounded in respect, care, dignity, and belonging.',
  },
  {
    title: 'New beginnings',
    description:
      'New ways of organizing, learning, relating, caring, and cultivating — alternatives to systems of inequality and exclusion.',
  },
];

const beliefs = [
  'We believe in the power of organized communities.',
  'We believe in feminist knowledge.',
  'We believe in peace and solidarity.',
  'We believe in ecological and social justice.',
];

const MwanzoMpya = () => {
  const [showLogo, setShowLogo] = useState(true);

  return (
    <div className={styles.page}>
      <SEOHead
        title="Mwanzo Mpya Women's Foundation"
        description="A feminist grassroots organization committed to building collective power, advancing social justice, and nurturing transformative alternatives rooted in communities across Kenya and the African region."
        keywords="Mwanzo Mpya, women's foundation Kenya, feminist grassroots, social justice, World March of Women Kenya"
        author="Mwanzo Mpya Women's Foundation"
      />
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <header className={styles.top}>
        <nav className={styles.nav} aria-label="Mwanzo Mpya">
          {showLogo ? (
            <img
              className={styles.logo}
              src="/mwanzo-mpya-logo.png"
              alt="Mwanzo Mpya"
              onError={() => setShowLogo(false)}
            />
          ) : (
            <p className={styles.wordmark}>Mwanzo Mpya</p>
          )}
          <Link className={styles.back} to="/">
            ← WMW Kenya
          </Link>
        </nav>
        <div className={styles.ribbon} aria-hidden="true" />
      </header>

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.orb} aria-hidden="true" />
          <p className={styles.label}>Mwanzo Mpya Women&apos;s Foundation</p>
          <h1 className={styles.headline}>
            A <span className={styles.sw}>New</span> Beginning
          </h1>
          <p className={styles.translation}>
            mwanzo mpya — Swahili for &quot;a new beginning&quot;
          </p>
          <p className={styles.lede}>
            A feminist grassroots organization committed to building collective
            power, advancing social justice, and nurturing transformative
            alternatives rooted in communities across Kenya and the African
            region. We believe another world is possible — and that communities
            hold the knowledge, power, and imagination to create it.
          </p>
          <div className={styles.ctaRow}>
            <a className={styles.btn} href="#pillars">
              What we do
            </a>
          </div>
        </header>

        <section className={styles.section} aria-labelledby="approach-heading">
          <p className={styles.tag} id="approach-heading">Our approach</p>
          <p>
            Our work is rooted in popular feminist education, grassroots
            organizing, community connection, and collective learning. We create
            spaces where women and communities across generations, identities,
            backgrounds, and lived experiences can come together to share
            knowledge, reflect on their realities, build consciousness, strengthen
            leadership, and organize for social, economic, ecological, and
            political transformation.
          </p>
        </section>

        <section id="pillars" className={`${styles.section} ${styles.pillars}`} aria-labelledby="pillars-heading">
          <p className={styles.tag}>Pillars of our work</p>
          <h2 id="pillars-heading">What holds this foundation up</h2>
          <div className={styles.grid}>
            {pillars.map((pillar) => (
              <article key={pillar.title} className={styles.card}>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-label="We believe">
          <div className={styles.beliefs}>
            {beliefs.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className={styles.final}>
              And we believe that together, we can create a new beginning.
            </p>
          </div>
        </section>

        <footer className={styles.footer}>
          <h2>Start something new with us</h2>
          <p className={styles.sub}>
            Whether you&apos;re joining, partnering, or just want updates — this is where it begins.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MwanzoMpya;
