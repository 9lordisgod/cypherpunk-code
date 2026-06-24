import { CoursesContent } from "@/components/planb/CoursesContent";
import { getCourseBySlug, getCoursesForBitcoinTrack } from "@/lib/planb/courses";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Bitcoin Course",
  description:
    "Free Bitcoin course track — learn fundamentals, self-custody, full nodes, and privacy techniques without trading noise.",
  path: "/courses",
  keywords: [
    "free bitcoin course",
    "learn bitcoin",
    "bitcoin curriculum",
    "bitcoin self custody course",
    "bitcoin full node course",
  ],
});

export default function CoursesPage() {
  const courses = getCoursesForBitcoinTrack();
  const featuredCourse = getCourseBySlug("btc101");

  if (!featuredCourse) {
    throw new Error("btc101 course metadata is required");
  }

  return <CoursesContent courses={courses} featuredCourse={featuredCourse} />;
}