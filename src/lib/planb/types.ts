export type PlanBCourseLevel = "beginner" | "intermediate" | "advanced" | "expert" | "wizard";

export type PlanBCourseTopic =
  | "bitcoin"
  | "business"
  | "mining"
  | "protocol"
  | "security"
  | "social studies";

export interface PlanBCourseMeta {
  slug: string;
  uuid: string;
  title: string;
  goal: string;
  topic: PlanBCourseTopic;
  level: PlanBCourseLevel;
  hours: number;
  languages: string[];
  contributorNames: string[];
  featured?: boolean;
  order?: number;
}

export interface PlanBCourseFrontmatter {
  name: string;
  goal: string;
  objectives: string[];
}

export interface PlanBChapter {
  slug: string;
  title: string;
  chapterId?: string;
  partTitle?: string;
  partId?: string;
  index: number;
  content: string;
}

export interface ParsedPlanBCourse {
  slug: string;
  language: string;
  frontmatter: PlanBCourseFrontmatter;
  description: string;
  chapters: PlanBChapter[];
  rawMeta?: Record<string, string | number | string[]>;
}

export interface BitcoinOriginalModule {
  courseSlug: string;
  label: string;
  description: string;
}

export interface BitcoinOriginalCourse {
  id: string;
  title: string;
  description: string;
  modules: BitcoinOriginalModule[];
}