import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
      <div className="max-w-md w-full text-center bg-white rounded-3xl border border-gray-200 p-8 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gray-900">404 - Page Not Found</h1>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          The page or product you are looking for does not exist or has been relocated.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-sm transition"
        >
          <Home className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
