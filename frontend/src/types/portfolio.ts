// Hand-written types matching the FastAPI `/api/portfolio` response shape.
// To regenerate from the running backend: `pnpm typegen`.

export interface Experience {
  id: string;
  hash: string;
  date: string;
  author: string;
  role: string;
  company: string;
  message: string;
  diff: string[];
}

export interface Project {
  id: string;
  filename: string;
  lang: string;
  description: string;
  problem: string;
  outcome: string;
  tech: string[];
  stars: string;
  status: string;
}

export interface StackItem {
  name: string;
  version?: string | null;
  note?: string | null;
}

export interface Cert {
  id: string;
  name: string;
  issuer: string;
  expiry: string;
  glyph: string;
}

export interface Portfolio {
  name: string;
  fullName: string;
  role: string;
  location: string;
  email: string;
  phone: string | null;
  github: string | null;
  linkedin: string | null;
  about: { raw: string };
  experience: Experience[];
  projects: Project[];
  stack: Record<string, StackItem[]>;
  certs: Cert[];
}

// Admin-side editable types (same shape, with extra editing fields).
export interface ExperienceAdmin extends Omit<Experience, "diff" | "date"> {
  date_range: string;
  bullets: string[];
  sort_order: number;
}

export interface ProjectAdmin extends Project {
  sort_order: number;
}

export interface StackGroupAdmin {
  id: string;
  slug: string;
  label: string;
  sort_order: number;
  items: StackItemAdmin[];
}

export interface StackItemAdmin extends StackItem {
  id: string;
  group_id: string;
  sort_order: number;
}

export interface CertAdmin extends Cert {
  sort_order: number;
}

export interface ProfileAdmin {
  name: string;
  full_name: string;
  role: string;
  location: string;
  email: string;
  phone: string | null;
  github: string | null;
  linkedin: string | null;
}
