import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Calculator, User, Calendar, Clock } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { CompatibilityResult } from "@shared/schema";
import { 
  calculateAbjadValue, 
  calculateDigitalRoot, 
  getElement, 
  calculateLifePathNumber,
  calculateNameCompatibility,
  calculateLifePathCompatibility,
  calculateOverallCompatibility,
  getCompatibilityLevel,
  getCompatibilityInsights,
  getMarriageAdvice
} from "@/utils/abjad-calculator";

const formSchema = z.object({
  partner1Name: z.string().min(1, "Partner 1 name is required"),
  partner1DateOfBirth: z.string().optional(),
  partner1BirthTime: z.string().optional(),
  partner2Name: z.string().min(1, "Partner 2 name is required"),
  partner2DateOfBirth: z.string().optional(),
  partner2BirthTime: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface Props {
  onResultCalculated: (result: CompatibilityResult) => void;
}

export default function CompatibilityForm({ onResultCalculated }: Props) {
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partner1Name: "",
      partner1DateOfBirth: "",
      partner1BirthTime: "",
      partner2Name: "",
      partner2DateOfBirth: "",
      partner2BirthTime: "",
    },
  });

  const createResultMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/compatibility-results", data);
      return res.json();
    },
    onSuccess: (result: CompatibilityResult) => {
      queryClient.invalidateQueries({ queryKey: ["/api/compatibility-results"] });
      onResultCalculated(result);
      toast({
        title: "Compatibility Calculated!",
        description: "Your spiritual compatibility has been analyzed.",
      });
    },
    onError: () => {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate compatibility. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsCalculating(true);
    
    // Validate input data
    if (!data.partner1Name.trim() || !data.partner2Name.trim()) {
      toast({
        title: "Input Error",
        description: "Please enter both partner names",
        variant: "destructive",
      });
      setIsCalculating(false);
      return;
    }
    
    // Simulate calculation delay for better UX (reduced for performance)
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      // Calculate Abjad values
      const partner1AbjadValue = calculateAbjadValue(data.partner1Name);
      const partner2AbjadValue = calculateAbjadValue(data.partner2Name);
      
      // Calculate digital roots
      const partner1DigitalRoot = calculateDigitalRoot(partner1AbjadValue);
      const partner2DigitalRoot = calculateDigitalRoot(partner2AbjadValue);
      
      // Get elements
      const partner1Element = getElement(partner1DigitalRoot);
      const partner2Element = getElement(partner2DigitalRoot);
      
      // Calculate life path numbers if dates provided
      const partner1LifePath = calculateLifePathNumber(data.partner1DateOfBirth || "");
      const partner2LifePath = calculateLifePathNumber(data.partner2DateOfBirth || "");
      
      // Calculate compatibility scores
      const nameCompatibilityScore = calculateNameCompatibility(partner1Element, partner2Element);
      
      let lifePathCompatibilityScore = null;
      if (partner1LifePath && partner2LifePath) {
        lifePathCompatibilityScore = calculateLifePathCompatibility(partner1LifePath, partner2LifePath);
      }
      
      const overallCompatibilityScore = calculateOverallCompatibility(nameCompatibilityScore, lifePathCompatibilityScore);
      
      const compatibilityLevel = getCompatibilityLevel(overallCompatibilityScore);
      const insights = getCompatibilityInsights(partner1Element, partner2Element, overallCompatibilityScore);
      const marriageAdvice = getMarriageAdvice(partner1Element, partner2Element, overallCompatibilityScore);

      // Create result object
      const resultData = {
        partner1Name: data.partner1Name,
        partner2Name: data.partner2Name,
        partner1DateOfBirth: data.partner1DateOfBirth || null,
        partner1BirthTime: data.partner1BirthTime || null,
        partner2DateOfBirth: data.partner2DateOfBirth || null,
        partner2BirthTime: data.partner2BirthTime || null,
        partner1AbjadValue,
        partner2AbjadValue,
        partner1DigitalRoot,
        partner2DigitalRoot,
        partner1Element: partner1Element.name,
        partner2Element: partner2Element.name,
        nameCompatibilityScore,
        lifePathCompatibilityScore,
        overallCompatibilityScore,
        compatibilityLevel,
        insights,
        marriageAdvice,
      };

      createResultMutation.mutate(resultData);
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "An error occurred during calculation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <Card className="card-islamic rounded-2xl shadow-2xl p-6 md:p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="font-amiri text-3xl font-bold text-[#2c3e50] mb-2">
            Enter Partner Details
          </h2>
          <p className="font-inter text-gray-700">
            Discover your compatibility through sacred numerology
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Partner 1 */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                    <User className="text-2xl text-white h-8 w-8" />
                  </div>
                  <h3 className="font-amiri text-xl font-semibold text-[#2c3e50]">First Partner</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="partner1Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <User className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Full Name (English) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                          placeholder="e.g., Ahmed Abdullah"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="partner1DateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <Calendar className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Date of Birth (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="partner1BirthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <Clock className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Birth Time (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Partner 2 */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                    <User className="text-2xl text-white h-8 w-8" />
                  </div>
                  <h3 className="font-amiri text-xl font-semibold text-[#2c3e50]">Second Partner</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="partner2Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <User className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Full Name (English) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                          placeholder="e.g., Fatima Zahra"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="partner2DateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <Calendar className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Date of Birth (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="partner2BirthTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block font-inter font-medium text-gray-700 mb-2">
                        <Clock className="inline text-[#f59e0b] mr-2 h-4 w-4" />
                        Birth Time (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="input-islamic w-full px-4 py-3 rounded-lg font-inter text-lg focus:outline-none focus:ring-2 focus:ring-[#f59e0b] transition-all duration-300"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="text-center pt-6">
              <Button
                type="submit"
                disabled={isCalculating || createResultMutation.isPending}
                className="btn-islamic px-8 py-4 rounded-full text-white font-inter font-semibold text-lg inline-flex items-center space-x-3 shadow-lg"
              >
                <Calculator className="h-5 w-5" />
                <span>Calculate Compatibility</span>
              </Button>
              
              {isCalculating && (
                <div className="mt-4">
                  <div className="loading-spinner mx-auto"></div>
                  <p className="font-inter text-gray-700 mt-2">Calculating spiritual compatibility...</p>
                </div>
              )}
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
