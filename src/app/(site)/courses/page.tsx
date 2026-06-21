import { CoursesContent } from "@/components/planb/CoursesContent";
import { getCourseBySlug, getCoursesForBitcoinTrack } from "@/lib/planb/courses";

export default function CoursesPage() {
  const courses = getCoursesForBitcoinTrack();
  const featuredCourse = getCourseBySlug("btc101");

  if (!featuredCourse) {
    throw new Error("btc101 course metadata is required");
  }

  return <CoursesContent courses={courses} featuredCourse={featuredCourse} />;
}