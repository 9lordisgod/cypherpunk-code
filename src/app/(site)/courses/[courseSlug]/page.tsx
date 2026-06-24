import { notFound } from "next/navigation";
import { CourseOverviewContent } from "@/components/planb/CourseOverviewContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { bitcoinCourse, getCourseBySlug, getCoursesForBitcoinTrack } from "@/lib/planb/courses";
import { fetchCourseContent } from "@/lib/planb/fetch";
import { buildBreadcrumbJsonLd, buildCourseJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

type CoursePageProps = {
  params: Promise<{ courseSlug: string }>;
};

export function generateStaticParams() {
  return getCoursesForBitcoinTrack().map((course) => ({
    courseSlug: course.slug,
  }));
}

export async function generateMetadata({ params }: CoursePageProps) {
  const { courseSlug } = await params;
  const course = getCourseBySlug(courseSlug);
  if (!course) {
    return { title: "Not Found" };
  }

  return buildPageMetadata({
    title: course.title,
    description: course.goal,
    path: `/courses/${course.slug}`,
    keywords: [
      course.title,
      "bitcoin course",
      course.topic,
      course.level,
      "free bitcoin education",
    ],
  });
}

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
    <>
      <JsonLd
        data={[
          buildCourseJsonLd({
            title: course.title,
            description: course.goal,
            path: `/courses/${course.slug}`,
            level: course.level,
            hours: course.hours,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Bitcoin Course", path: "/courses" },
            { name: course.title, path: `/courses/${course.slug}` },
          ]),
        ]}
      />
      <CourseOverviewContent
        course={course}
        parsed={parsed}
        moduleLabel={trackModule?.label}
      />
    </>
  );
}