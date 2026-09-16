import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import Timeline from '../ui/Timeline';

/** Joins a start and end into one readable period string. */
export function period(start, end) {
  if (start && end) return `${start} — ${end}`;
  return start || end || '';
}

export default function Education({ education = [] }) {
  if (!education.length) return null;

  const items = education.map((e) => ({
    id: e._id,
    eyebrow: e.degree,
    title: e.fullDegreeName || e.degree,
    subtitle: e.institution,
    meta: e.location,
    description: e.description,
    period: period(e.startDate, e.endDate),
  }));

  return (
    <Section id="journey" index="03" label="Education & training" tone="sand">
      <div className="max-w-measure">
        <SectionTitle id="journey-heading">
          <MaskedLines lines={['Education', '& training']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          From undergraduate medical training in Nagpur through super-specialisation in plastic and
          reconstructive surgery in Mumbai.
        </Reveal>
      </div>

      <div className="mt-14 lg:mt-20">
        <Timeline items={items} />
      </div>
    </Section>
  );
}