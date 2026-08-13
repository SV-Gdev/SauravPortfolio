import { contactInfo } from '@/data/portfolio-data';

export default function ContactSection() {
  return (
    <section id="contact" className="pb-32">
      <h2 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">Get In Touch</h2>
      <p className="text-[var(--text-secondary)] text-[1.1rem] mb-12">
        Interested in collaborating on a game project, discussing opportunities, or just want to connect?
      </p>

      <div
        className="grid gap-8 mt-12"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
      >
        {contactInfo.map((info) => (
          <a
            key={info.title}
            href={info.href || undefined}
            target={info.href ? '_blank' : undefined}
            rel={info.href ? 'noopener noreferrer' : undefined}
            className="p-10 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl transition-all duration-300 no-underline text-inherit block hover:border-[var(--accent-primary)] hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="text-4xl mb-4">{info.icon}</div>
            <h3 className="text-[1.4rem] font-bold mb-2">{info.title}</h3>
            <p className="text-[var(--text-secondary)] text-[0.95rem] leading-[1.6]">
              {info.description}
            </p>
            {info.linkText && (
              <span className="text-[var(--accent-primary)] break-all font-mono text-[0.9rem] mt-2 block">
                {info.linkText}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* CTA Box */}
      <div className="mt-16 text-center py-12 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]">
        <h3
          className="text-[2rem] font-bold mb-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
        >
          Let&apos;s Build Something Amazing Together! ✨
        </h3>
        <p className="text-[var(--text-secondary)] text-[1.1rem] max-w-[700px] mx-auto mb-8">
          Whether you&apos;re looking for a game developer for your team, want to discuss a project
          idea, or just want to chat about game development — don&apos;t hesitate to reach out.
        </p>
        <a
          href="mailto:[your.email@example.com]"
          className="px-10 py-4 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white no-underline rounded-xl font-semibold text-base transition-all duration-300 shadow-[0_4px_20px_rgba(0,212,255,0.3)] border-none cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,212,255,0.4)]"
        >
          Send Me a Message
        </a>
      </div>
    </section>
  );
}