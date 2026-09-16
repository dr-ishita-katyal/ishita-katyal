import { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { applySeo, setRobots, buildStructuredData, injectStructuredData } from '../lib/seo';

import Nav from '../components/site/Nav';
import Hero from '../components/site/Hero';
import Credentials from '../components/site/Credentials';
import About from '../components/site/About';
import Duality from '../components/site/Duality';
import Expertise from '../components/site/Expertise';
import Education from '../components/site/Education';
import Experience from '../components/site/Experience';
import SpecialistTraining from '../components/site/SpecialistTraining';
import Awards from '../components/site/Awards';
import Publications from '../components/site/Publications';
import Workshops from '../components/site/Workshops';
import Gallery from '../components/site/Gallery';
import Contact from '../components/site/Contact';
import Footer from '../components/site/Footer';
import ScrollProgress from '../components/ui/ScrollProgress';

export default function Home() {
  const site = useSite();
  const { profile, contact, settings, education, experience, expertise, awards, publications, workshops, gallery } =
    site;

  const show = settings?.sections || {};

  useEffect(() => {
    setRobots('index, follow');
    applySeo({
      title: settings?.siteTitle,
      description: settings?.metaDescription,
      canonicalUrl: settings?.canonicalUrl,
      ogImage: settings?.ogImage?.url || profile?.profileImage?.url,
      favicon: settings?.favicon?.url,
    });
    injectStructuredData(buildStructuredData({ profile, contact, settings, education }));
  }, [settings, profile, contact, education]);

  return (
    <div className="relative">
      <div aria-hidden="true" className="grain-overlay" />
      <ScrollProgress />
      <Nav name={profile?.name} title={profile?.title} appointmentUrl={contact?.appointmentUrl} />

      <main id="main">
        <Hero profile={profile} appointmentUrl={contact?.appointmentUrl} />
        <Credentials profile={profile} />
        <About profile={profile} />
        <Duality expertise={expertise} />
        <Expertise expertise={expertise} />
        <Education education={education} />
        <Experience experience={experience} />
        {show.specialistTraining !== false && <SpecialistTraining experience={experience} />}
        {show.awards !== false && <Awards awards={awards} />}
        {show.publications !== false && <Publications publications={publications} />}
        {show.workshops && <Workshops workshops={workshops} />}
        {show.gallery && <Gallery gallery={gallery} />}
        <Contact contact={contact} />
      </main>

      <Footer profile={profile} contact={contact} settings={settings} />
    </div>
  );
}
