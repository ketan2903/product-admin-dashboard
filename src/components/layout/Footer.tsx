import React from "react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Nexgensis Technologies Pvt. Ltd. Product Admin Dashboard</p>
        <div className="flex items-center gap-4 text-gray-400">
          <span>Powered by DummyJSON API</span>
          <span>&bull;</span>
          <span>Next.js &amp; Tailwind CSS</span>
        </div>
      </div>
    </footer>
  );
}
