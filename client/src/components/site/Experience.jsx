import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import Timeline from '../ui/Timeline';
import { period } from './Education';

export default function Experience({ experience = [] }) {
  const roles = experience.filter((e) => (e.track || 'experience') === 'experience');
  if (!roles.length) return null;

  const items = roles.map((e) => ({
    id: e._id,
    eyebrow: e.designation,
    title: e.institution,
    subtitle: e.department,
    meta: e.location,
    description: e.description,
    period: period(e.startDate, e.endDate),
  }));

  return (
    <Section id="experience" index="04" label="Professional experience" tone="ivory">
      <div className="max-w-measure">
        <SectionTitle id="experience-heading">
          <MaskedLines lines={['Professional', 'experience']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          Clinical and academic appointments across teaching hospitals in Mumbai, listed most recent first.
        </Reveal>
      </div>

      <div className="mt-14 lg:mt-20">
        <Timeline items={items} />
      </div>
    </Section>
  );
}