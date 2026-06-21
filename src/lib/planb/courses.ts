import bitcoinOriginalCourse from "@/data/bitcoin-original-course.json";
import planbCourses from "@/data/planb-courses.json";
import type { BitcoinOriginalCourse, PlanBCourseMeta } from "./types";

const courses = planbCourses as PlanBCourseMeta[];

export const bitcoinCourse = bitcoinOriginalCourse as BitcoinOriginalCourse;

export function getAllCourses(): PlanBCourseMeta[] {
  return [...courses].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getFeaturedCourses(): PlanBCourseMeta[] {
  return getAllCourses().filter((course) => course.featured);
}

export function getCourseBySlug(slug: string): PlanBCourseMeta | undefined {
  return courses.find((course) => course.slug === slug);
}

export function getCoursesForBitcoinTrack(): PlanBCourseMeta[] {
  const slugs = new Set(bitcoinCourse.modules.map((module) => module.courseSlug));
  return getAllCourses().filter((course) => slugs.has(course.slug));
}