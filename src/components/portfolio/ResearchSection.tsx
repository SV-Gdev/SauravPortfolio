export default function ResearchSection() {
  return (
    <section
      id="research"
      className="bg-[var(--bg-secondary)] rounded-3xl py-20 px-12 my-16 border border-[var(--border-color)]"
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">📄</span>
        <div>
          <div className="text-[0.9rem] text-[var(--accent-primary)] font-semibold uppercase tracking-widest">
            Academic Research
          </div>
          <h2 className="text-[2.5rem] font-extrabold tracking-tight">Research Publication</h2>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] p-12 rounded-2xl border border-[var(--border-color)]">
        <h3 className="text-2xl font-bold mb-6 text-[var(--accent-primary)]">
          [Paper Title Placeholder]
        </h3>

        <div className="text-[var(--text-secondary)] text-[1.05rem] leading-[1.9] mb-8 p-6 bg-[rgba(0,0,0,0.2)] border-l-4 border-[var(--accent-secondary)] rounded-md">
          <strong className="text-[var(--accent-primary)] block mb-3">Abstract:</strong>
          [One-paragraph research abstract describing the paper&apos;s focus, methodology, findings,
          and contributions to the field. This section will be updated with actual research content
          once the paper is finalized and ready for publication. The abstract will provide readers
          with a comprehensive overview of the research objectives, approach, key findings, and
          significance of the work.]
        </div>

        <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-[0.9rem]">Publication Status:</span>
            <span className="text-[var(--text-primary)] font-semibold font-mono text-[0.9rem]">
              [Journal/Conference Name] — [Year]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-secondary)] text-[0.9rem]">Research Topics:</span>
            <span className="text-[var(--text-primary)] font-semibold font-mono text-[0.9rem]">
              [Keywords]
            </span>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <a
            href="#"
            className="px-7 py-3 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,212,255,0.3)] inline-flex items-center gap-2"
          >
            📥 Download PDF
          </a>
          <a
            href="#"
            className="px-7 py-3 bg-transparent text-[var(--text-primary)] no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.05)] inline-flex items-center gap-2"
          >
            Read Online
          </a>
          <a
            href="#"
            className="px-7 py-3 bg-transparent text-[var(--text-primary)] no-underline rounded-lg font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] hover:bg-[rgba(0,212,255,0.05)] inline-flex items-center gap-2"
          >
            Citation
          </a>
        </div>
      </div>
    </section>
  );
}