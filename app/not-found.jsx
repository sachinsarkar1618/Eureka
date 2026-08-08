// not-found.jsx

import React from 'react';
import { TbError404 } from "react-icons/tb";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        <TbError404 size={128} className="mx-auto mb-8" />
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </div>
  );
}
