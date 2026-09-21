import React from 'react';
import GlobalHeader from '../components/GlobalHeader';
import Footer from '../components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. GLOBAL NAVIGATION */}
      {/* Uses the renamed Navbar (GlobalHeader) for premium glassmorphism effect */}
      <GlobalHeader />

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="flex-grow">
        {/* 
            PRD Aesthetic Check: 
            We use a subtle background tint for the main content area 
            to make the white cards in your pages "pop" with depth.
        */}
        <div className="relative">
            {/* Optional: Global Background Accent for Premium Feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent -z-10" />
            
            {children}
        </div>
      </main>

      {/* 3. PLATFORM FOOTER */}
      <Footer />
    </div>
  );
};

export default MainLayout;