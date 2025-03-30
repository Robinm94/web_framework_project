import NavLinks from "@/components/dashboard/nav-links";
import Link from "next/link";
import SignOut from "@/components/dashboard/signout";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-slate-900 md:block"></div>
        <form>
          <Link href="/">
            <SignOut />
          </Link>
        </form>
      </div>
    </div>
  );
}
