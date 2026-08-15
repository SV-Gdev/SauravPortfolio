'use client';

import { useState } from 'react';
import Card3DEffect from '@/components/portfolio/Card3DEffect';

export default function ResearchSection() {
  const [copied, setCopied] = useState(false);

  const ieeeLink = 'https://ieeexplore.ieee.org/document/11467552';
  const pdfPath = '/IC3ET3382_IEEE_eXpress.pdf';

  const citationText = `@INPROCEEDINGS{11467552,
  author={Pathak, Sunny and Sharma, Saurav and Kumar, Ayush and Bhuran, Supriya and Phadke, Gargi},
  booktitle={IEEE International Conference on Computing, Communication, and Green Engineering (IC3ET)}, 
  title={Real-Time Clinician Sentiment to Steer Adaptive AI in Critical Care Decisions}, 
  year={2026},
  url={https://ieeexplore.ieee.org/document/11467552}
}`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="research"
      className="bg-[var(--bg-secondary)] rounded-3xl py-20 px-6 sm:px-12 my-16 border border-[var(--border-color)] relative z-10 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-center gap-4 mb-10">
        <span className="text-4xl">📚</span>
        <div>
          <div className="text-[0.9rem] text-[var(--accent-primary)] font-semibold uppercase tracking-widest font-mono">
            IEEE Research Publication
          </div>
          <h2 className="text-[2.2rem] sm:text-[2.8rem] font-extrabold tracking-tight bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
            Academic Research & Publications
          </h2>
        </div>
      </div>

      <Card3DEffect intensity={6}>
        <div className="bg-[var(--bg-card)] p-8 sm:p-12 rounded-2xl border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
          {/* IEEE Publication Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span className="px-4 py-1.5 bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] rounded-full text-xs font-mono font-bold text-[var(--accent-primary)] inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
              IEEE Xplore Document #11467552
            </span>

            <span className="text-xs font-mono text-[var(--text-secondary)]">
              D. Y. Patil Deemed to be University, RAIT
            </span>
          </div>

          {/* Paper Title */}
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-snug text-white">
            Real-Time Clinician Sentiment to Steer Adaptive AI in Critical Care Decisions
          </h3>

          {/* Authors List */}
          <p className="text-[0.95rem] font-mono text-[var(--accent-secondary)] mb-8">
            <strong>Authors:</strong> Sunny Pathak, <span className="text-white underline decoration-[var(--accent-primary)] underline-offset-4 font-bold">Saurav Sharma</span>, Ayush Kumar, Supriya Bhuran, Gargi Phadke
          </p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-[rgba(0,212,255,0.05)] border border-[rgba(0,212,255,0.2)] rounded-xl text-center">
              <div className="text-2xl font-extrabold text-[var(--accent-primary)] font-mono">99.03%</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">Test Accuracy</div>
            </div>

            <div className="p-4 bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)] rounded-xl text-center">
              <div className="text-2xl font-extrabold text-[var(--accent-secondary)] font-mono">11.3 ms</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">Inference Latency</div>
            </div>

            <div className="p-4 bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)] rounded-xl text-center">
              <div className="text-2xl font-extrabold text-[#10b981] font-mono">200,000</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">Clinical Dataset</div>
            </div>

            <div className="p-4 bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] rounded-xl text-center">
              <div className="text-2xl font-extrabold text-[#f59e0b] font-mono">BioMed</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">RoBERTa Model</div>
            </div>
          </div>

          {/* Abstract Block */}
          <div className="text-[var(--text-secondary)] text-[1.02rem] leading-[1.8] mb-8 p-6 bg-[rgba(0,0,0,0.4)] border-l-4 border-[var(--accent-primary)] rounded-xl">
            <strong className="text-[var(--accent-primary)] block mb-3 text-sm font-mono uppercase tracking-wider">
              📄 Abstract:
            </strong>
            Integration of Artificial Intelligence (AI) in healthcare decision making is usually limited due to a lack of trust in the technology by clinicians and the inability of non-living systems to keep up with human sentiment. This paper proposes a novel framework where real-time clinician sentiment steers adaptive AI, allowing it to dynamically adjust its decision-making behavior to match user confidence. Using a fine-tuned BioMed-RoBERTa language model trained on a 200,000-entry clinical sentiment dataset, our system categorizes clinician trust versus skepticism with <strong>99.03% test accuracy</strong> and <strong>11.3 ms latency</strong>. In a 10,000-trial critical care simulation, the adaptive AI dynamically adjusted human-in-the-loop oversight thresholds from 34% up to 87% based on real-time feedback, establishing a robust mechanism for safety-critical clinical environments.
          </div>

          {/* Research Index Terms / Keywords */}
          <div className="mb-8">
            <span className="text-xs font-mono text-[var(--text-secondary)] block mb-3">INDEX TERMS / KEYWORDS:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Artificial Intelligence',
                'Sentiment Analysis',
                'BioMed-RoBERTa',
                'Adaptive Systems',
                'Clinical Decision Support',
                'AI Safety',
                'Human-in-the-Loop',
              ].map((term) => (
                <span
                  key={term}
                  className="px-3.5 py-1.5 bg-[rgba(255,255,255,0.04)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] font-mono"
                >
                  #{term}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="flex gap-4 flex-wrap pt-6 border-t border-[var(--border-color)]">
            <a
              href={pdfPath}
              download="IC3ET3382_IEEE_eXpress.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,212,255,0.4)] inline-flex items-center gap-2"
            >
              📥 Download PDF (IEEE Paper)
            </a>

            <a
              href={ieeeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 bg-transparent text-white no-underline rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--accent-primary)] cursor-pointer hover:bg-[rgba(0,212,255,0.1)] hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              🌐 Read Online on IEEE Xplore ↗
            </a>

            <button
              onClick={handleCopyCitation}
              className="px-7 py-3.5 bg-transparent text-[var(--text-secondary)] rounded-xl font-semibold text-[0.95rem] transition-all duration-300 border border-[var(--border-color)] cursor-pointer hover:text-white hover:border-white inline-flex items-center gap-2"
            >
              {copied ? '✅ Citation Copied!' : '📋 Copy BibTeX Citation'}
            </button>
          </div>
        </div>
      </Card3DEffect>
    </section>
  );
}