export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  techTags: string[];
  image: string;
  roleBadge: string;
  githubUrl?: string;
  docsUrl?: string;
  meta?: { label: string; value: string }[];
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const featuredFeatures: Feature[] = [
  { icon: "\uD83C\uDFAF", title: "Intelligent Enemy AI", description: "Pathfinding, combat behavior trees, and dynamic difficulty scaling" },
  { icon: "\uD83D\uDCE6", title: "Inventory System", description: "Complete item management with stacking, usage, and persistence" },
  { icon: "\uD83D\uDCBE", title: "Save/Load System", description: "Persistent player progress with JSON serialization" },
  { icon: "\uD83D\uDD2B", title: "Combat Mechanics", description: "Weapon switching, ammo management, and hit detection" },
  { icon: "\uD83C\uDFA5", title: "Camera System", description: "Smooth third-person camera with collision and zoom" },
  { icon: "\uD83D\uDCCA", title: "Game Metrics", description: "Real-time stats tracking and performance monitoring" },
];

export const featuredProjectMeta = [
  { label: "Engine", value: "Unity 2022" },
  { label: "Language", value: "C#" },
  { label: "Genre", value: "Third-Person Action" },
  { label: "Duration", value: "6+ months" },
  { label: "Status", value: "In Development" },
];

export const projects: Project[] = [
  {
    id: "shooter",
    title: "Shooter Game",
    category: "Flagship Project",
    description:
      "A fully-featured third-person action shooter showcasing advanced game development skills. This project demonstrates expertise in enemy AI programming, inventory management systems, and persistent save/load functionality \u2014 all built from the ground up in Unity.",
    techTags: ["Unity", "C#", "AI Programming", "Game Systems"],
    image: "/images/download.jpg",
    roleBadge: "Solo Developer",
    githubUrl: "https://github.com/SV-Gdev",
  },
  {
    id: "knuckle2",
    title: "Knuckle2",
    category: "Group Project",
    description:
      "Collaborative fighting game developed as part of a team project. Focused on implementing responsive combat mechanics, character animations, and multiplayer interaction systems within a shared codebase.",
    techTags: ["Unity", "C#", "Team Collaboration", "Animation System"],
    image: "/images/knuckle2.png",
    roleBadge: "Team Member",
    githubUrl: "https://github.com/SV-Gdev",
  },
  {
    id: "mario",
    title: "Mario Recreation",
    category: "Solo Recreation",
    description:
      "A faithful recreation of classic Mario gameplay mechanics built as a learning exercise. Implemented precise platforming physics, level design principles, and enemy behavior patterns from scratch.",
    techTags: ["Unity", "C#", "2D Physics", "Level Design"],
    image: "/images/mario-recreation.png",
    roleBadge: "Solo Developer",
  },
  {
    id: "orion",
    title: "Orion Healthcare Backend",
    category: "Backend Project",
    description:
      "Engineering coursework project focused on healthcare backend software development. Built robust data management systems for medical applications, implementing secure database architecture and RESTful API endpoints for healthcare data handling.",
    techTags: ["Python", "SQL", "Backend Architecture", "Database Design"],
    image: "/images/orion-health.png",
    roleBadge: "Backend Developer",
    githubUrl: "https://github.com/AARAV-git/orion-backend",
    docsUrl: "#",
  },
];

export interface SkillCategory {
  icon: string;
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    icon: "\uD83C\uDFAE",
    title: "Game Development",
    skills: [
      "Unity Engine (Advanced)",
      "Unreal Engine (Intermediate)",
      "C# Programming (Proficient)",
      "C/C++ (Intermediate)",
      "Game Physics & Collision Systems",
      "AI Behavior Trees & State Machines",
      "UI/UX Design for Games",
      "Version Control (Git)",
    ],
  },
  {
    icon: "\uD83D\uDCBB",
    title: "Software Engineering",
    skills: [
      "Python (Proficient)",
      "SQL Databases",
      "Backend Development",
      "Software Architecture",
    ],
  },
  {
    icon: "\uD83D\uDD27",
    title: "Tools & Workflow",
    skills: [
      "Agile/Scrum Methodology",
      "Collaborative Team Development",
      "Rapid Prototyping",
      "Debugging & Optimization",
    ],
  },
];

export interface ContactInfo {
  icon: string;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  href?: string;
}

export const contactInfo: ContactInfo[] = [
  {
    icon: "\uD83D\uDCBC",
    title: "GitHub",
    description: "Check out my code repositories, ongoing projects, and contributions",
    linkText: "https://github.com/SV-Gdev",
    href: "https://github.com/SV-Gdev",
  },
  {
    icon: "\uD83D\uDD17",
    title: "LinkedIn",
    description: "Professional network, career updates, and recommendations",
    linkText: "linkedin.com/in/saurav-sharma-569097429",
    href: "https://www.linkedin.com/in/saurav-sharma-569097429",
  },
  {
    icon: "\uD83D\uDCE7",
    title: "Email",
    description: "Direct contact for collaborations, job inquiries, and project discussions",
    linkText: "[your.email@example.com]",
  },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Featured", href: "#featured-project" },
  { label: "Projects", href: "#projects" },
  { label: "Research", href: "#research" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];
