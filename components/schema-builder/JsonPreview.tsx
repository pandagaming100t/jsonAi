import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { SchemaField } from '@/types/schema';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

interface JsonPreviewProps {
  fields: SchemaField[];
}

export const JsonPreview: React.FC<JsonPreviewProps> = ({ fields }) => {
  const generateJsonFromFields = (fields: SchemaField[]): any => {
    const result: any = {};

    fields.forEach(field => {
      if (field.type === 'Nested' || field.type === 'Object') {
        result[field.name] = field.children ? generateJsonFromFields(field.children) : {};
      } else if (field.type === 'Array') {
        result[field.name] = field.value || [];
      } else if (field.type === 'Boolean') {
        result[field.name] = field.value !== undefined ? field.value : false;
      } else if (field.type === 'Date') {
        result[field.name] = field.value || new Date().toISOString().split('T')[0];
      } else if (field.type === 'Email') {
        result[field.name] = field.value || 'example@email.com';
      } else if (field.type === 'URL') {
        result[field.name] = field.value || 'https://example.com';
      } else if (field.type === 'UUID') {
        result[field.name] = field.value || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      } else if (field.type === 'Enum') {
        result[field.name] = field.value || (field.enumValues && field.enumValues[0]) || '';
      } else if (field.type === 'Number' || field.type === 'Integer' || field.type === 'Float') {
        result[field.name] = field.value !== undefined ? field.value : 0;
      } else {
        result[field.name] = field.value || '';
      }
    });

    return result;
  };

  const jsonOutput = generateJsonFromFields(fields);
  const jsonString = JSON.stringify(jsonOutput, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      toast.success('JSON copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy JSON');
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('JSON file downloaded!');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">JSON Preview</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadJson}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[calc(100vh-250px)] w-full">
          <pre className="p-6 text-sm font-mono whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded-lg m-4 border">
            <code className="language-json">{jsonString}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};