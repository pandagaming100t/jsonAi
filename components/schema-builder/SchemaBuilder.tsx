"use client"

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SchemaField, SavedSchema } from '@/types/schema';
import { NestedFields } from './NestedFields';
import { JsonPreview } from './JsonPreview';
import { SavedSchemas } from './SavedSchemas';
import { AIAssistant } from './AIAssistant';
import { SchemaExport } from './SchemaExport';
import { SchemaValidation } from './SchemaValidation';
import { SchemaTemplates } from './SchemaTemplates';
import { SchemaHistory } from './SchemaHistory';
import { Save, Sparkles, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils';

export const SchemaBuilder: React.FC = () => {
  const [fields, setFields] = useState<SchemaField[]>([
    {
      id: generateId(),
      name: 'example_field',
      type: 'String',
      value: 'Default String'
    }
  ]);

  const [savedSchemas, setSavedSchemas] = useState<SavedSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [schemaName, setSchemaName] = useState('');

  useEffect(() => {
    fetchSavedSchemas();
  }, []);

  const fetchSavedSchemas = async () => {
    try {
      const response = await fetch('/api/schemas');
      if (response.ok) {
        const data = await response.json();
        setSavedSchemas(data.schemas);
      }
    } catch (error) {
      console.error('Failed to fetch schemas:', error);
    }
  };

  const handleFieldsChange = (newFields: SchemaField[]) => {
    setFields(newFields);
  };

  const handleSaveSchema = async () => {
    if (!schemaName.trim()) {
      toast.error('Please enter a schema name');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/schemas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: schemaName,
          schema: fields,
        }),
      });

      if (response.ok) {
        toast.success('Schema saved successfully!');
        setSaveDialogOpen(false);
        setSchemaName('');
        fetchSavedSchemas();
      } else {
        toast.error('Failed to save schema');
      }
    } catch (error) {
      toast.error('Failed to save schema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSchema = (schema: SavedSchema) => {
    setFields(schema.schema);
    toast.success(`Loaded schema: ${schema.name}`);
  };

  const handleAIGenerate = (generatedFields: SchemaField[]) => {
    setFields(generatedFields);
    toast.success('Schema generated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">JSON Schema Builder</h1>
            <p className="text-gray-600 dark:text-gray-300">Create and visualize JSON schemas with dynamic field management</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <AIAssistant onGenerate={handleAIGenerate} />
            
            <SchemaTemplates onLoadTemplate={handleFieldsChange} />
            
            <SchemaExport fields={fields} />
            
            <SchemaValidation fields={fields} />
            
            <SchemaHistory fields={fields} onRestore={handleFieldsChange} />
            
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Schema
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Schema</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter schema name..."
                    value={schemaName}
                    onChange={(e) => setSchemaName(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSchema} disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="builder" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="builder" className="text-lg">Schema Builder</TabsTrigger>
            <TabsTrigger value="preview" className="text-lg">JSON Preview</TabsTrigger>
            <TabsTrigger value="saved" className="text-lg flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Saved Schemas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Build Your Schema</CardTitle>
                <p className="text-gray-600 dark:text-gray-300">Add, edit, and organize your JSON schema fields</p>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-400px)] w-full pr-4">
                  <NestedFields
                    fields={fields}
                    onFieldsChange={handleFieldsChange}
                    level={0}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <JsonPreview fields={fields} />
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedSchemas 
              schemas={savedSchemas} 
              onLoad={handleLoadSchema}
              onRefresh={fetchSavedSchemas}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};