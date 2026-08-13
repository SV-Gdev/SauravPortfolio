import { skillCategories } from '@/data/portfolio-data';

export default function AboutSection() {
  return (
    <section id="about" className="pt-24">
      <h2 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">About Me & Resume</h2>
      <p className="text-[var(--text-secondary)] text-[1.1rem] mb-12">
        Skills, experience, and professional background
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
        {/* Bio */}
        <div>
          <h3 className="text-[1.8rem] font-bold mb-6 text-[var(--accent-primary)]">👤 Who I Am</h3>
          <p className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.8] mb-6">
            I&apos;m{' '}
            <strong className="text-[var(--accent-primary)]">Saurav Sharma</strong>, an
            aspiring game developer passionate about creating immersive interactive experiences.
            With hands-on experience in both{' '}
            <strong>Unity (1.5+ years)</strong> and{' '}
            <strong>Unreal Engine (7 months)</strong>, I specialize in building polished gameplay
            systems that players love.
          </p>
          <p className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.8] mb-6">
            I thrive in collaborative environments, working closely with designers and artists to
            bring creative visions to life. As a hackathon participant, I&apos;m accustomed to
            rapid prototyping and iterative development under tight deadlines.
          </p>
          <p className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.8]">
            My focus areas include{' '}
            <strong>player controllers</strong> with responsive movement,{' '}
            <strong>intelligent enemy AI</strong> with complex behaviors,{' '}
            <strong>interactable UI systems</strong>, and{' '}
            <strong>persistent save/load functionality</strong>.
          </p>

          <div className="mt-8 p-6 bg-[rgba(139,92,246,0.1)] border-l-4 border-[var(--accent-secondary)] rounded-md">
            <strong className="text-[var(--accent-secondary)]">🎯 Currently Open To:</strong>
            <p className="mt-2 text-[var(--text-secondary)] text-[0.95rem]">
              Game development opportunities, team collaborations, indie projects, and internship positions
            </p>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-[1.8rem] font-bold mb-6 text-[var(--accent-primary)]">
            💼 Technical Skills
          </h3>

          {skillCategories.map((cat) => (
            <div key={cat.title} className="mb-10">
              <h4 className="text-[1.2rem] font-semibold mb-4 text-[var(--text-primary)]">
                {cat.icon} {cat.title}
              </h4>
              <ul className="list-none">
                {cat.skills.map((skill) => (
                  <li
                    key={skill}
                    className="py-2.5 text-[var(--text-secondary)] border-b border-[rgba(255,255,255,0.05)] flex items-center gap-3"
                  >
                    <span className="text-[var(--accent-primary)] font-bold">▹</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Resume Download */}
      <div className="mt-12 py-10 bg-[var(--bg-card)] border-2 border-dashed border-[var(--border-color)] rounded-2xl text-center">
        <h3 className="text-[1.5rem] font-bold mb-4">📥 Download Full Resume</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Complete resume with detailed project descriptions, education history, achievements, and
          contact information
        </p>
        <a
          href="#"
          className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(0,212,255,0.3)] border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)]"
        >
          Download PDF Resume
        </a>
      </div>
    </section>
  );
}