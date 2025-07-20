import CompatibilityForm from "@/components/compatibility-form";
import ResultsDisplay from "@/components/results-display";
import HistorySection from "@/components/history-section";
import AboutSection from "@/components/about-section";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { CompatibilityResult } from "@shared/schema";

export default function Home() {
  const [currentResult, setCurrentResult] = useState<CompatibilityResult | null>(null);

  const handleNewCalculation = () => {
    setCurrentResult(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1d4ed8] min-h-screen islamic-pattern">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 geometric-border opacity-20"></div>
        <div className="relative z-10 text-center py-8 px-4">
          <div className="animate-fade-in">
            <h1 className="font-amiri text-4xl md:text-5xl font-bold text-white mb-2">
              <Heart className="inline-block text-[#f59e0b] mr-3 h-12 w-12" />
              Muslim Compatibility Checker
            </h1>
            <p className="font-inter text-lg text-gray-200 mb-4">
              Find your spiritual connection through Islamic numerology
            </p>
            <div className="rtl-support font-scheherazade text-2xl text-[#f59e0b]">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Main Compatibility Form */}
        <CompatibilityForm onResultCalculated={setCurrentResult} />
        
        {/* Results Display */}
        {currentResult && (
          <ResultsDisplay 
            result={currentResult} 
            onNewCalculation={handleNewCalculation}
          />
        )}
        
        {/* History Section */}
        <HistorySection />
        
        {/* About Section */}
        <AboutSection />
      </main>

      {/* Footer */}
      <footer className="bg-[#1e3a8a] text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="rtl-support font-scheherazade text-xl text-[#f59e0b] mb-4">
            اللَّهُمَّ بَارِكْ لَهُمَا وَبَارِكْ عَلَيْهِمَا
          </div>
          <p className="font-inter text-gray-300 mb-4">
            "O Allah, bless them and bless [their relationship] for them"
          </p>
          <p className="font-inter text-sm text-gray-300">
            © 2024 Muslim Compatibility Checker. Made with love for the Ummah
          </p>
        </div>
      </footer>
    </div>
  );
}
