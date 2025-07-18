import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SchemaField } from '@/types/schema';
import { Download, Code, FileJson, FileCode } from 'lucide-react';
import { toast } from 'sonner';

interface SchemaExportProps {
  fields: SchemaField[];
}

export const SchemaExport: React.FC<SchemaExportProps> = ({ fields }) => {
  const [isOpen, setIsOpen] = useState(false);

  const convertToJsonSchema = (fields: SchemaField[]): any => {
    const properties: any = {};
    const required: string[] = [];

    fields.forEach(field => {
      if (field.type === 'Nested' && field.children) {
        properties[field.name] = {
          type: 'object',
          properties: convertToJsonSchema(field.children).properties,
          required: convertToJsonSchema(field.children).required || []
        };
      } else if (field.type === 'String') {
        properties[field.name] = {
          type: 'string',
          default: field.value || ''
        };
      } else if (field.type === 'Number') {
        properties[field.name] = {
          type: 'number',
          default: field.value || 0
        };
      }
      required.push(field.name);
    });

    return {
      type: 'object',
      properties,
      required
    };
  };

  const generateTypeScriptInterface = (fields: SchemaField[], interfaceName: string = 'Schema'): string => {
    const generateInterface = (fields: SchemaField[], name: string, level: number = 0): string => {
      const indent = '  '.repeat(level);
      let result = `${indent}interface ${name} {\n`;
      
      fields.forEach(field => {
        if (field.type === 'Nested' && field.children) {
          const childInterfaceName = `${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`;
          result += `${indent}  ${field.name}: ${childInterfaceName};\n`;
        } else if (field.type === 'String') {
          result += `${indent}  ${field.name}: string;\n`;
        } else if (field.type === 'Number') {
          result += `${indent}  ${field.name}: number;\n`;
        }
      });
      
      result += `${indent}}\n\n`;
      
      // Generate nested interfaces
      fields.forEach(field => {
        if (field.type === 'Nested' && field.children) {
          const childInterfaceName = `${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`;
          result += generateInterface(field.children, childInterfaceName, level);
        }
      });
      
      return result;
    };

    return generateInterface(fields, interfaceName);
  };

  const generatePythonClass = (fields: SchemaField[], className: string = 'Schema'): string => {
    const generateClass = (fields: SchemaField[], name: string): string => {
      let result = `class ${name}:\n`;
      result += `    def __init__(self):\n`;
      
      fields.forEach(field => {
        if (field.type === 'Nested' && field.children) {
          result += `        self.${field.name} = ${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}()\n`;
        } else if (field.type === 'String') {
          result += `        self.${field.name} = "${field.value || ''}"\n`;
        } else if (field.type === 'Number') {
          result += `        self.${field.name} = ${field.value || 0}\n`;
        }
      });
      
      result += '\n';
      
      // Generate nested classes
      fields.forEach(field => {
        if (field.type === 'Nested' && field.children) {
          const childClassName = `${field.name.charAt(0).toUpperCase()}${field.name.slice(1)}`;
          result += generateClass(field.children, childClassName);
        }
      });
      
      return result;
    };

    return generateClass(fields, className);
  };

  const jsonSchema = convertToJsonSchema(fields);
  const typescriptCode = generateTypeScriptInterface(fields);
  const pythonCode = generatePythonClass(fields);
  const sampleData = JSON.stringify(fields.reduce((acc: any, field) => {
    if (field.type === 'Nested' && field.children) {
      acc[field.name] = field.children.reduce((childAcc: any, child) => {
        childAcc[child.name] = child.value;
        return childAcc;
      }, {});
    } else {
      acc[field.name] = field.value;
    }
    return acc;
  }, {}), null, 2);

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error(`Failed to copy ${type}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Schema
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCode className="h-5 w-5" />
            Export Schema
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="json-schema" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="json-schema" className="flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              JSON Schema
            </TabsTrigger>
            <TabsTrigger value="typescript" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              TypeScript
            </TabsTrigger>
            <TabsTrigger value="python" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Python
            </TabsTrigger>
            <TabsTrigger value="sample" className="flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              Sample Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="json-schema" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">JSON Schema</Badge>
                <span className="text-sm text-muted-foreground">Standard JSON Schema format</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(jsonSchema, null, 2), 'JSON Schema')}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(JSON.stringify(jsonSchema, null, 2), 'schema.json', 'application/json')}
                >
                  Download
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm">
                <code>{JSON.stringify(jsonSchema, null, 2)}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="typescript" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <span className="text-sm text-muted-foreground">Type definitions for TypeScript</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(typescriptCode, 'TypeScript interfaces')}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(typescriptCode, 'schema.ts', 'text/typescript')}
                >
                  Download
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm">
                <code>{typescriptCode}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="python" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Python</Badge>
                <span className="text-sm text-muted-foreground">Python class definitions</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(pythonCode, 'Python classes')}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(pythonCode, 'schema.py', 'text/python')}
                >
                  Download
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm">
                <code>{pythonCode}</code>
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="sample" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Sample Data</Badge>
                <span className="text-sm text-muted-foreground">Example JSON data based on your schema</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(sampleData, 'Sample data')}
                >
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(sampleData, 'sample-data.json', 'application/json')}
                >
                  Download
                </Button>
              </div>
            </div>
            <ScrollArea className="h-96 w-full rounded-md border">
              <pre className="p-4 text-sm">
                <code>{sampleData}</code>
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};