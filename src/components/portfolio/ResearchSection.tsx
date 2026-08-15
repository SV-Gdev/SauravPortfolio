export default function ResearchSection() {
  return (
    <section
      id="research"
      className="bg-[var(--bg-secondary)] rounded-3xl py-20 px-8 sm:px-12 my-16 border border-[var(--border-color)] max-w-[1200px] mx-auto"
    >
      <div className="flex items-center gap-4 mb-10">
        <span className="text-4xl">📄</span>
        <div>
          <div className="text-[0.9rem] text-[var(--accent-primary)] font-semibold uppercase tracking-widest">
            IEEE Published Research
          </div>
          <h2 className="text-[2.5rem] font-extrabold tracking-tight">Research Publication</h2>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-8 sm:p-12 rounded-2xl border border-[var(--border-color)] relative overflow-hidden">

        {/* IEEE Badge */}
        <div className="flex items-center gap-3 mb-6">
          <span className="px-4 py-1.5 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-xs font-bold text-[var(--accent-primary)] font-mono tracking-wider">
            🏆 IEEE Published — IC3ET 2025
          </span>
          <span className="px-4 py-1.5 bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.3)] rounded-full text-xs font-bold text-[var(--accent-secondary)] font-mono">
            DOI: 10.1109/IC3ET64196.2025.11467552
          </span>
        </div>

        {/* Paper Title */}
        <h3 className="text-[1.6rem] sm:text-[1.85rem] font-bold mb-4 text-[var(--accent-primary)] leading-tight">
          Real-Time Clinician Sentiment to Steer Adaptive AI in Critical Care Decisions
        </h3>

        {/* Authors */}
        <p className="text-[var(--text-secondary)] text-[0.95rem] mb-8 font-mono">
          Sunny Pathak · <strong className="text-[var(--accent-primary)]">Saurav</strong> · Ayush Kumar · Supriya Bhuran · Gargi Phadke
          <br />
          <span className="text-[0.85rem] opacity-70">RAIT, D. Y. Patil Deemed to be University, Nerul, Navi Mumbai, India</span>
        </p>

        {/* Abstract */}
        <div className="text-[var(--text-secondary)] text-[1.0rem] leading-[1.9] mb-8 p-6 bg-[rgba(0,0,0,0.2)] border-l-4 border-[var(--accent-secondary)] rounded-md">
          <strong className="text-[var(--accent-primary)] block mb-3">Abstract:</strong>
          Integration of Artificial Intelligence (AI) in healthcare decision making is usually limiting due to a lack of trust in the technology by clinicians and the inability of the non-living system to keep up with the living human sentiment. The novel framework proposed in this paper is that the real-time clinician sentiment should be applied to steer adaptive AI and permit it to adjust its behaviour and match the user confidence. In doing so, a BioMed-RoBERTa language model was fine-tuned on a large-scale (200,000-entry) dataset — a combination of clean and noisy synthetic data — to categorize clinician sentiment as sensitive categories of trust and skepticism with an accuracy of <strong className="text-white">99.03%</strong> on the hidden test data. In a large-scale simulation (10,000 trials), the adaptive AI exhibited significant behavioural adaptation relative to the baseline (static), demonstrating that sentiment-as-a-signal is a successful mechanism to rationalize AI behavior in high-stakes settings.
        </div>

        {/* Metadata Grid */}
        <div className="grid gap-4 mb-8 text-[0.9rem]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl">
            <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Conference</div>
            <div className="text-[var(--text-primary)] font-semibold font-mono">IC3ET 2025 — IEEE</div>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl">
            <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Accuracy</div>
            <div className="text-[var(--accent-primary)] font-bold font-mono text-lg">99.03%</div>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl">
            <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Model</div>
            <div className="text-[var(--text-primary)] font-semibold font-mono">BioMed-RoBERTa</div>
          </div>
          <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[var(--border-color)] rounded-xl">
            <div className="text-[var(--text-secondary)] text-xs uppercase tracking-wider mb-1">Simulation Scale</div>
            <div className="text-[var(--text-primary)] font-semibold font-mono">10,000 Trials</div>
          </div>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            'Artificial Intelligence',
            'Machine Learning',
            'Sentiment Analysis',
            'Adaptive Systems',
            'Clinical Decision Support',
            'AI Safety',
            'Human-in-the-Loop',
            'NLP',
            'Trust',
          ].map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded-md text-xs text-[var(--text-secondary)] font-mono"
            >
              {kw}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap pt-6 border-t border-[var(--border-color)]">
          <a
            href="/IC3ET3382_IEEE_eXpress.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,212,255,0.4)] inline-flex items-center gap-2"
          >
            📥 Download PDF
          </a>
          <a
            href="https://ieeexplore.ieee.org/document/11467552"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 bg-transparent text-[var(--text-primary)] no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.05)] inline-flex items-center gap-2"
          >
            🌐 Read on IEEE Xplore ↗
          </a>
          <a
            href="https://ieeexplore.ieee.org/document/11467552"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3 bg-transparent text-[var(--text-primary)] no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-secondary)] hover:text-[var(--accent-secondary)] hover:bg-[rgba(139,92,246,0.05)] inline-flex items-center gap-2 font-mono text-[0.85rem]"
          >
            📋 DOI: 10.1109/IC3ET64196.2025.11467552
          </a>
        </div>
      </div>
    </section>
  );
}