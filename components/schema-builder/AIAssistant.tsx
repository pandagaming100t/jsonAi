import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SchemaField } from '@/types/schema';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AIAssistantProps {
  onGenerate: (fields: SchemaField[]) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-schema', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (response.ok) {
        const data = await response.json();
        onGenerate(data.schema);
        setIsOpen(false);
        setPrompt('');
      } else {
        toast.error('Failed to generate schema');
      }
    } catch (error) {
      toast.error('Failed to generate schema');
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    "User profile with name, email, age, and address",
    "E-commerce product with title, price, description, and categories",
    "Blog post with title, content, author, and metadata",
    "API response with status, data, and error handling"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20">
          <Sparkles className="h-4 w-4" />
          AI Generate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Schema Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Describe your schema:
            </label>
            <Input
              placeholder="e.g., User profile with name, email, and preferences..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full"
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-600 dark:text-gray-300">
              Example prompts:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {examplePrompts.map((example, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-left h-auto p-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Schema
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};