import { notFound } from "next/navigation";
import { CourseOverviewContent } from "@/components/planb/CourseOverviewContent";
import { bitcoinCourse, getCourseBySlug } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";

type CoursePageProps = {
  params: Promise<{ courseSlug: string }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const parsed = await fetchCourseContent(courseSlug);
  const trackModule = bitcoinCourse.modules.find(
    (item) => item.courseSlug === courseSlug
  );

  return (
    <CourseOverviewContent
      course={course}
      parsed={parsed}
      moduleLabel={trackModule?.label}
    />
  );
}