import { AccountContent } from "@/components/auth/AccountContent";
import { privatePageMetadata } from "@/lib/seo/metadata";

export const metadata = privatePageMetadata("/account", "Account");

export default function AccountPage() {
  return <AccountContent />;
}