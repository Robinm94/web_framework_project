import NavLinks from "@/components/dashboard/nav-links";
import Link from "next/link";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-slate-900 md:block"></div>
        <form>
          <Link href="/">
            <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-slate-900 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
                />
              </svg>

              <div className="hidden md:block">Sign Out</div>
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
