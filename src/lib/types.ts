export interface Project {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  techStack: string;
  liveDemo: string | null;
  github: string | null;
  screenshot: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}
