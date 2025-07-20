import { Card } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";

export default function AboutSection() {
  return (
    <Card className="card-islamic rounded-2xl shadow-2xl p-6 md:p-8">
      <h2 className="font-amiri text-2xl font-bold text-[#2c3e50] mb-6">
        <Info className="inline text-[#f59e0b] mr-3 h-6 w-6" />
        About Islamic Numerology
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-amiri text-xl font-semibold text-[#2c3e50]">Abjad System</h3>
          <p className="font-inter text-gray-800 leading-relaxed">
            The Abjad numerical system assigns values to Arabic letters, creating a sacred connection between names and their spiritual essence. This ancient practice has been used for centuries in Islamic tradition.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-amiri text-xl font-semibold text-[#2c3e50]">Four Elements</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full element-fire"></div>
              <span className="font-inter">Fire (نار) - Passionate, ambitious</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full element-air"></div>
              <span className="font-inter">Air (ہوا) - Intellectual, communicative</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full element-water"></div>
              <span className="font-inter">Water (ماء) - Emotional, intuitive</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full element-earth"></div>
              <span className="font-inter">Earth (تراب) - Stable, grounded</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
        <p className="font-inter text-sm text-yellow-800">
          <AlertTriangle className="inline text-yellow-600 mr-2 h-4 w-4" />
          This tool is for entertainment and spiritual reflection purposes. True compatibility depends on many factors including faith, character, and mutual understanding.
        </p>
      </div>
    </Card>
  );
}
