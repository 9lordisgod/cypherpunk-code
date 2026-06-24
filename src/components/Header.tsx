import { AuthButtonShell } from "@/components/auth/AuthButtonShell";
import { HeaderNav } from "@/components/HeaderNav";
import { auth } from "@/auth";

export async function Header() {
  const session = await auth();

  return (
    <HeaderNav
      session={session}
      desktopAuthShell={<AuthButtonShell session={session} />}
      mobileAuthShell={<AuthButtonShell session={session} mobile />}
    />
  );
}