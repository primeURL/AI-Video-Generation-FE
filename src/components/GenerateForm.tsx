import { useState, FormEvent, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";

const generateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.enum(["script", "topic"]),
});

type GenerateFormValues = z.infer<typeof generateSchema>;

interface GenerateFormProps {
  onGenerate: (data: GenerateFormValues) => void;
}

export function GenerateForm({ onGenerate }: GenerateFormProps) {
  const [generationMethod, setGenerationMethod] = useState<"script" | "topic">("topic");
  const [formValues, setFormValues] = useState<GenerateFormValues>({
    title: "",
    content: "",
    type: "topic"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (): boolean => {
    const result = generateSchema.safeParse(formValues);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };
  
  // const handleSelectChange = (name: keyof GenerateFormValues, value: string) => {
  //   setFormValues(prev => ({ ...prev, [name]: value }));
  // };
  
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onGenerate(formValues);
    }
  };
  
  const setMethod = (method: "script" | "topic") => {
    setGenerationMethod(method);
    setFormValues(prev => ({ 
      ...prev, 
      type: method,
      content: method === "topic" ? "" : prev.content 
    }));
  };
  
  const handleTopicSelect = (topic: string) => {
    // Set title based on selected topic
    const topicTitles: Record<string, string> = {
      "photosynthesis": "Photosynthesis of Plants",
      "solar-system": "The Solar System",
      "water-cycle": "The Water Cycle",
      "human-body": "Human Body Systems",
      "dinosaurs": "Dinosaurs and Prehistoric Life",
    };
    
    setFormValues(prev => ({ 
      ...prev, 
      title: topicTitles[topic] || "",
      content: topic 
    }));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="generation-method" className="mb-1">Generation Method</Label>
            <div className="flex flex-wrap gap-4">
            <Button
                type="button"
                id="topic-method"
                variant={generationMethod === "topic" ? "default" : "secondary"}
                onClick={() => setMethod("topic")}
              >
                Select Topic
              </Button>
              <Button
                type="button"
                id="script-method"
                variant={generationMethod === "script" ? "default" : "secondary"}
                onClick={() => setMethod("script")}
              >
                Use Script
              </Button>
            
            </div>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {generationMethod === "script" ? (
              <>
                <div>
                  <Label htmlFor="video-title" className="mb-1">Video Title</Label>
                  <Input
                    id="video-title"
                    name="title"
                    placeholder="Enter a title for your video"
                    value={formValues.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="script-content" className="mb-1">Script Content</Label>
                  <Textarea
                    id="script-content"
                    name="content"
                    placeholder="Enter your educational script here..."
                    className="min-h-[120px]"
                    value={formValues.content}
                    onChange={handleInputChange}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                  )}
                  <p className="mt-2 text-sm text-slate-500">
                    Write a clear, educational script that explains your topic in detail.
                  </p>
                </div>
              </>
            ) : (
              <div>
                <Label htmlFor="topic-selector" className="mb-1">Select Topic</Label>
                <Select 
                  value={formValues.content} 
                  onValueChange={(value) => {
                    handleTopicSelect(value);
                  }}
                >
                  <SelectTrigger id="topic-selector">
                    <SelectValue placeholder="Select a predefined topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photosynthesis">Photosynthesis of Plants</SelectItem>
                    <SelectItem value="solar-system">The Solar System</SelectItem>
                    <SelectItem value="water-cycle">The Water Cycle</SelectItem>
                    <SelectItem value="human-body">Human Body Systems</SelectItem>
                    <SelectItem value="dinosaurs">Dinosaurs and Prehistoric Life</SelectItem>
                  </SelectContent>
                </Select>
                {errors.content && (
                  <p className="text-sm text-red-500 mt-1">{errors.content}</p>
                )}
                <p className="mt-2 text-sm text-slate-500">
                  Choose from our predefined educational topics.
                </p>
              </div>
            )} 
            <div>
              Default Avatar
              <Avatar className="w-30 h-30 bg-primary border-2 border-blue-400">
              <AvatarImage 
                src={'https://d-id-public-bucket.s3.us-west-2.amazonaws.com/alice.jpg'} 
                alt="Profile picture"
              />
        </Avatar>
            </div>
          
            <Button 
              type="submit" 
              className="w-full mt-2"
              disabled={
                (generationMethod === "script" && (!formValues.content || formValues.content.length < 10)) ||
                (generationMethod === "topic" && !formValues.content)
              }
            >
              Generate Video
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
