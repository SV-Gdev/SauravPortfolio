import { projects } from '@/data/portfolio-data';
import ProjectCard from './ProjectCard';

export default function ProjectsSection() {
  return (
    <section id="projects" className="pt-24">
      <h2 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">My Projects</h2>
      <p className="text-[var(--text-secondary)] text-[1.1rem] mb-12">
        A showcase of my game development and software engineering work
      </p>

      <div className="grid gap-12 mt-12">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}