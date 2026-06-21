import { notFound } from "next/navigation";
import { CourseChapterContent } from "@/components/planb/CourseChapterContent";
import { bitcoinCourse, getCourseBySlug } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";

type CourseChapterPageProps = {
  params: Promise<{ courseSlug: string; chapterSlug: string }>;
};

export default async function CourseChapterPage({ params }: CourseChapterPageProps) {
  const { courseSlug, chapterSlug } = await params;
  const course = getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const parsed = await fetchCourseContent(courseSlug);
  const chapter = parsed.chapters.find((item) => item.slug === chapterSlug);

  if (!chapter) {
    notFound();
  }

  const trackModule = bitcoinCourse.modules.find(
    (item) => item.courseSlug === courseSlug
  );

  return (
    <CourseChapterContent
      course={course}
      courseTitle={parsed.frontmatter.name || course.title}
      chapter={chapter}
      chapters={parsed.chapters}
      language={parsed.language}
      moduleLabel={trackModule?.label}
    />
  );
}