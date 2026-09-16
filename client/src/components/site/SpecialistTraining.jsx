import { Section, SectionTitle } from '../ui/Section';
import { Reveal, MaskedLines } from '../ui/Reveal';
import Timeline from '../ui/Timeline';
import { period } from './Education';

/**
 * Entries without an institution are shown as awaiting details rather than
 * padded with assumptions — they are filled in from /admin/experience.
 */
export default function SpecialistTraining({ experience = [] }) {
  const training = experience.filter((e) => e.track === 'training');
  if (!training.length) return null;

  const items = training.map((e) => {
    const incomplete = !e.institution && !e.startDate && !e.endDate;
    return {
      id: e._id,
      eyebrow: e.designation,
      title: e.institution || e.designation,
      subtitle: e.institution ? e.department : '',
      meta: e.location,
      description: incomplete ? e.description || 'Details to be updated.' : e.description,
      period: period(e.startDate, e.endDate),
      muted: incomplete,
    };
  });

  return (
    <Section id="training" index="06" label="Specialist training" tone="cream">
      <div className="max-w-measure">
        <SectionTitle id="training-heading">
          <MaskedLines lines={['Specialist', 'training']} lineClassName="text-heading" />
        </SectionTitle>
        <Reveal as="p" delay={0.1} className="lede mt-6">
          Training undertaken beyond super-specialisation, including onco-reconstruction at Tata
          Memorial Hospital.
        </Reveal>
      </div>

      <div className="mt-14 lg:mt-20">
        <Timeline items={items} />
      </div>
    </Section>
  );
}
