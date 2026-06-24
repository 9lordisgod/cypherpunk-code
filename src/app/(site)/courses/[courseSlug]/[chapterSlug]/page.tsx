import { notFound } from "next/navigation";
import { CourseChapterContent } from "@/components/planb/CourseChapterContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { bitcoinCourse, getCourseBySlug, getCoursesForBitcoinTrack } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";
import { buildBreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

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

export async function generateMetadata({ params }: CourseChapterPageProps) {
  const { courseSlug, chapterSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { title: "Not Found" };
  }

  try {
    const parsed = await fetchCourseContent(courseSlug);
    const chapter = parsed.chapters.find((item) => item.slug === chapterSlug);
    if (!chapter) {
      return { title: "Not Found" };
    }

    const description = `${chapter.title} — chapter from ${course.title} on Cypherpunk Code.`;

    return buildPageMetadata({
      title: `${chapter.title} — ${course.title}`,
      description,
      path: `/courses/${courseSlug}/${chapterSlug}`,
      ogType: "article",
      keywords: [chapter.title, course.title, "bitcoin course", course.level],
    });
  } catch {
    return buildPageMetadata({
      title: course.title,
      description: course.goal,
      path: `/courses/${courseSlug}/${chapterSlug}`,
    });
  }
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
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Bitcoin Course", path: "/courses" },
          { name: course.title, path: `/courses/${courseSlug}` },
          {
            name: chapter.title,
            path: `/courses/${courseSlug}/${chapterSlug}`,
          },
        ])}
      />
      <CourseChapterContent
        course={course}
        courseTitle={parsed.frontmatter.name || course.title}
        chapter={chapter}
        chapters={parsed.chapters}
        language={parsed.language}
        moduleLabel={trackModule?.label}
      />
    </>
  );
}