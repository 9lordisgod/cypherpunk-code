import { AdminDashboard } from "@/components/auth/AdminDashboard";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("/admin", "Admin");

export default function AdminPage() {
  return <AdminDashboard />;
}