import React from "react";
import "@/assets/styles/globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import BackArrow from "@/components/BackArrow";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Eureka",
  description: "Intuitive solutions for competitive programming contests",
};

const MainLayout = ({ children }) => {
  return (
    <AuthProvider>
      <html className="h-full">
        <body className="h-full bg-gray-800">
          <div className="min-h-full flex flex-col">
            {/* Navbar */}
            <Navbar />
            <BackArrow />
            {/* Content Section */}
            <div className="flex-grow">
              {children}
              <Analytics />
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
};

export default MainLayout;
