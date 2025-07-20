import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Clock } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CompatibilityResult } from "@shared/schema";

export default function HistorySection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: historyResults = [], isLoading } = useQuery<CompatibilityResult[]>({
    queryKey: ["/api/compatibility-results"],
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/compatibility-results");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/compatibility-results"] });
      toast({
        title: "History Cleared",
        description: "All compatibility results have been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to clear history. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClearHistory = () => {
    if (historyResults.length === 0) return;
    
    if (confirm('Are you sure you want to clear all history?')) {
      clearHistoryMutation.mutate();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="card-islamic rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-amiri text-2xl font-bold text-[#2c3e50]">
          <History className="inline text-[#f59e0b] mr-3 h-6 w-6" />
          Calculation History
        </h2>
        <Button
          onClick={handleClearHistory}
          disabled={clearHistoryMutation.isPending || historyResults.length === 0}
          variant="ghost"
          className="text-gray-500 hover:text-red-500 transition-colors duration-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="font-inter text-gray-500">Loading history...</p>
        </div>
      ) : historyResults.length > 0 ? (
        <div className="space-y-4">
          {historyResults.map((result) => (
            <div 
              key={result.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-[#f59e0b] transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-inter font-semibold text-[#2c3e50]">
                    {result.partner1Name} & {result.partner2Name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Calculated on {formatDate(result.createdAt.toString())}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-[#2c3e50]">{result.overallCompatibilityScore}%</div>
                  <div className="text-sm text-gray-600">{result.compatibilityLevel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="mx-auto text-6xl text-gray-300 mb-4 h-16 w-16" />
          <p className="font-inter text-gray-500">No calculations yet. Start your first compatibility check above!</p>
        </div>
      )}
    </Card>
  );
}
