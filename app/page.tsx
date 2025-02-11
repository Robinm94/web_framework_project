import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="bg-slate-900 p-8 rounded-md shadow-md w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-6 text-white">Finance Tracker</h1>
        <p className="text-lg text-gray-300 mb-8">
          Manage your budgets and expenses effortlessly.
        </p>
        <div className="flex space-x-4 justify-center">
          <Link
            href="/login"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
