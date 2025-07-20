import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Lightbulb, Heart, Share, Save, Plus, Copy, MessageCircle, Camera, Mail } from "lucide-react";
import type { CompatibilityResult } from "@shared/schema";
import { getElement } from "@/utils/abjad-calculator";
import { useToast } from "@/hooks/use-toast";
import { 
  copyToClipboard, 
  shareToWhatsApp, 
  shareToTwitter, 
  shareAsImage, 
  shareViaEmail,
  generateShareText 
} from "@/utils/share-utils";

interface Props {
  result: CompatibilityResult;
  onNewCalculation: () => void;
}

export default function ResultsDisplay({ result, onNewCalculation }: Props) {
  const { toast } = useToast();
  
  const partner1Element = getElement(result.partner1DigitalRoot);
  const partner2Element = getElement(result.partner2DigitalRoot);

  const getCompatibilityCircleClass = (score: number) => {
    if (score >= 80) return "compatibility-high";
    if (score >= 60) return "compatibility-medium";
    return "compatibility-low";
  };

  const handleCopyToClipboard = async () => {
    const shareText = generateShareText(result);
    const success = await copyToClipboard(shareText);
    toast({
      title: success ? "Copied!" : "Copy Failed",
      description: success ? "Results copied to clipboard" : "Unable to copy results",
      variant: success ? "default" : "destructive",
    });
  };

  const handleWhatsAppShare = () => {
    const shareText = generateShareText(result);
    shareToWhatsApp(shareText);
  };

  const handleImageShare = async () => {
    const success = await shareAsImage('compatibility-results', 'muslim-compatibility.png');
    if (!success) {
      toast({
        title: "Share Failed",
        description: "Unable to generate image",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    shareViaEmail(result);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Muslim Compatibility Results',
      text: `${result.partner1Name} & ${result.partner2Name} - ${result.compatibilityScore}% Compatible`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback for browsers without Web Share API
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(shareData.text);
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    }
  };

  const handleSave = () => {
    toast({
      title: "Results Saved!",
      description: "Your compatibility results have been saved to history.",
    });
  };

  return (
    <div className="animate-slide-up">
      <Card id="compatibility-results" className="card-islamic rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="font-amiri text-3xl font-bold text-[#2c3e50] mb-2">
            <Star className="inline text-[#f59e0b] mr-3 h-8 w-8" />
            Compatibility Results
          </h2>
          <p className="font-inter text-gray-700">Based on Islamic numerology and elemental analysis</p>
        </div>

        {/* Compatibility Score */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto rounded-full border-8 border-gray-200 relative overflow-hidden">
              <div className={`w-full h-full rounded-full ${getCompatibilityCircleClass(result.overallCompatibilityScore)} relative`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{result.overallCompatibilityScore}%</div>
                    <div className="text-sm text-white font-inter">Compatible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="font-amiri text-2xl font-bold text-[#2c3e50] mt-4">
            {result.compatibilityLevel}
          </h3>
          <p className="font-inter text-gray-700 mt-2">
            {result.partner1Name} & {result.partner2Name}
          </p>
          
          {/* Detailed Compatibility Breakdown */}
          <div className="compatibility-breakdown grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <h4 className="font-inter font-semibold text-blue-800 mb-2">Name Compatibility</h4>
              <div className="text-2xl font-bold text-blue-600">{result.nameCompatibilityScore}%</div>
              <p className="text-sm text-blue-700">Based on elements</p>
            </div>
            
            {result.lifePathCompatibilityScore && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <h4 className="font-inter font-semibold text-green-800 mb-2">Life Path Compatibility</h4>
                <div className="text-2xl font-bold text-green-600">{result.lifePathCompatibilityScore}%</div>
                <p className="text-sm text-green-700">Based on birth dates</p>
              </div>
            )}
            
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <h4 className="font-inter font-semibold text-amber-800 mb-2">Overall Score</h4>
              <div className="text-2xl font-bold text-amber-600">{result.overallCompatibilityScore}%</div>
              <p className="text-sm text-amber-700">Combined analysis</p>
            </div>
          </div>
        </div>

        {/* Element Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="text-center">
            <h4 className="font-amiri text-xl font-semibold text-[#2c3e50] mb-4">{result.partner1Name} Analysis</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-medium text-gray-800">Name Value:</span>
                  <span className="font-mono font-bold text-[#2c3e50]">{result.partner1AbjadValue}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-medium text-gray-800">Digital Root:</span>
                  <span className="font-mono font-bold text-[#2c3e50]">{result.partner1DigitalRoot}</span>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <div className={`px-4 py-2 rounded-full text-white font-inter font-semibold ${partner1Element.class}`}>
                    <span className="mr-2">{partner1Element.icon}</span>
                    {partner1Element.name} Element
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h4 className="font-amiri text-xl font-semibold text-[#2c3e50] mb-4">{result.partner2Name} Analysis</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-medium text-gray-800">Name Value:</span>
                  <span className="font-mono font-bold text-[#2c3e50]">{result.partner2AbjadValue}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-inter font-medium text-gray-800">Digital Root:</span>
                  <span className="font-mono font-bold text-[#2c3e50]">{result.partner2DigitalRoot}</span>
                </div>
                <div className="flex items-center justify-center mt-3">
                  <div className={`px-4 py-2 rounded-full text-white font-inter font-semibold ${partner2Element.class}`}>
                    <span className="mr-2">{partner2Element.icon}</span>
                    {partner2Element.name} Element
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-[#f59e0b]">
            <h4 className="font-amiri text-xl font-semibold text-[#2c3e50] mb-3">
              <Lightbulb className="inline text-[#f59e0b] mr-2 h-5 w-5" />
              Relationship Insights
            </h4>
            <p className="font-inter text-gray-700 leading-relaxed">
              {result.insights}
            </p>
          </div>

          <div className="p-6 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-[#f59e0b]">
            <h4 className="font-amiri text-xl font-semibold text-[#2c3e50] mb-3">
              <Heart className="inline text-[#f59e0b] mr-2 h-5 w-5" />
              Marriage Compatibility
            </h4>
            <p className="font-inter text-gray-700 leading-relaxed">
              {result.marriageAdvice}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mt-8">
          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onNewCalculation}
              className="btn-islamic px-6 py-3 rounded-lg text-white font-inter font-semibold inline-flex items-center justify-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Calculation</span>
            </Button>
            
            <Button 
              onClick={handleSave}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-inter font-semibold inline-flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-300"
            >
              <Save className="h-4 w-4" />
              <span>Save to History</span>
            </Button>
          </div>
          
          {/* Share Options */}
          <div className="text-center">
            <p className="font-inter text-gray-600 mb-3">Share your results:</p>
            <div className="share-buttons flex flex-wrap gap-3 justify-center">
              <Button 
                onClick={handleCopyToClipboard}
                variant="outline"
                className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-inter font-medium inline-flex items-center space-x-2 hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
              
              <Button 
                onClick={handleWhatsAppShare}
                variant="outline"
                className="px-4 py-2 rounded-lg border-2 border-green-300 text-green-700 font-inter font-medium inline-flex items-center space-x-2 hover:border-green-500 hover:text-green-800 transition-all duration-300"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </Button>
              
              <Button 
                onClick={handleImageShare}
                variant="outline"
                className="px-4 py-2 rounded-lg border-2 border-amber-300 text-amber-700 font-inter font-medium inline-flex items-center space-x-2 hover:border-amber-500 hover:text-amber-800 transition-all duration-300"
              >
                <Camera className="h-4 w-4" />
                <span>Image</span>
              </Button>
              
              <Button 
                onClick={handleEmailShare}
                variant="outline"
                className="px-4 py-2 rounded-lg border-2 border-blue-300 text-blue-700 font-inter font-medium inline-flex items-center space-x-2 hover:border-blue-500 hover:text-blue-800 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
