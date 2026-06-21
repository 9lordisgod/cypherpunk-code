import { notFound } from "next/navigation";
import { CourseChapterContent } from "@/components/planb/CourseChapterContent";
import { bitcoinCourse, getCourseBySlug, getCoursesForBitcoinTrack } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";

type CourseChapterPageProps = {
  params: Promise<{ courseSlug: string; chapterSlug: string }>;
};

export async function generateStaticParams() {
  const courses = getCoursesForBitcoinTrack();
  const params: Array<{ courseSlug: string; chapterSlug: string }> = [];

  await Promise.all(
    courses.map(async (course) => {
      try {
        const parsed = await fetchCourseContent(course.slug);
        for (const chapter of parsed.chapters) {
          params.push({
            courseSlug: course.slug,
            chapterSlug: chapter.slug,
          });
        }
      } catch (error) {
        console.warn(`Skipping chapter static params for ${course.slug}:`, error);
      }
    })
  );

  return params;
}

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