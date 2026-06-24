import { AdminLoginContent } from "@/components/auth/AdminLoginContent";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("/admin/login", "Admin Sign In");

export default function AdminLoginPage() {
  return <AdminLoginContent />;
}