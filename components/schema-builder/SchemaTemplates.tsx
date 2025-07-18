import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { SchemaField } from '@/types/schema';
import { BookTemplate as Template, User, ShoppingCart, FileText, Database, Globe, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { generateId } from '@/lib/utils';

interface SchemaTemplatesProps {
  onLoadTemplate: (fields: SchemaField[]) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  fields: SchemaField[];
}

export const SchemaTemplates: React.FC<SchemaTemplatesProps> = ({ onLoadTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const templates: Template[] = [
    {
      id: 'user-profile',
      name: 'User Profile',
      description: 'Basic user profile with personal information',
      category: 'User Management',
      icon: User,
      fields: [
        { id: generateId(), name: 'id', type: 'Number', value: 1 },
        { id: generateId(), name: 'firstName', type: 'String', value: 'John' },
        { id: generateId(), name: 'lastName', type: 'String', value: 'Doe' },
        { id: generateId(), name: 'email', type: 'String', value: 'john.doe@example.com' },
        { id: generateId(), name: 'age', type: 'Number', value: 30 },
        {
          id: generateId(),
          name: 'address',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'street', type: 'String', value: '123 Main St' },
            { id: generateId(), name: 'city', type: 'String', value: 'New York' },
            { id: generateId(), name: 'zipCode', type: 'String', value: '10001' },
            { id: generateId(), name: 'country', type: 'String', value: 'USA' }
          ]
        }
      ]
    },
    {
      id: 'product',
      name: 'E-commerce Product',
      description: 'Product schema for e-commerce applications',
      category: 'E-commerce',
      icon: ShoppingCart,
      fields: [
        { id: generateId(), name: 'id', type: 'Number', value: 1 },
        { id: generateId(), name: 'name', type: 'String', value: 'Product Name' },
        { id: generateId(), name: 'description', type: 'String', value: 'Product description' },
        { id: generateId(), name: 'price', type: 'Number', value: 99.99 },
        { id: generateId(), name: 'currency', type: 'String', value: 'USD' },
        { id: generateId(), name: 'inStock', type: 'Number', value: 1 },
        { id: generateId(), name: 'category', type: 'String', value: 'Electronics' },
        {
          id: generateId(),
          name: 'specifications',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'weight', type: 'Number', value: 1.5 },
            { id: generateId(), name: 'dimensions', type: 'String', value: '10x5x2 inches' },
            { id: generateId(), name: 'color', type: 'String', value: 'Black' }
          ]
        }
      ]
    },
    {
      id: 'blog-post',
      name: 'Blog Post',
      description: 'Blog post schema with metadata',
      category: 'Content Management',
      icon: FileText,
      fields: [
        { id: generateId(), name: 'id', type: 'Number', value: 1 },
        { id: generateId(), name: 'title', type: 'String', value: 'Blog Post Title' },
        { id: generateId(), name: 'content', type: 'String', value: 'Blog post content...' },
        { id: generateId(), name: 'excerpt', type: 'String', value: 'Short excerpt' },
        { id: generateId(), name: 'publishedAt', type: 'String', value: '2024-01-01T00:00:00Z' },
        { id: generateId(), name: 'status', type: 'String', value: 'published' },
        {
          id: generateId(),
          name: 'author',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'name', type: 'String', value: 'Author Name' },
            { id: generateId(), name: 'email', type: 'String', value: 'author@example.com' },
            { id: generateId(), name: 'bio', type: 'String', value: 'Author biography' }
          ]
        },
        {
          id: generateId(),
          name: 'metadata',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'tags', type: 'String', value: 'tag1,tag2,tag3' },
            { id: generateId(), name: 'readTime', type: 'Number', value: 5 },
            { id: generateId(), name: 'views', type: 'Number', value: 0 }
          ]
        }
      ]
    },
    {
      id: 'api-response',
      name: 'API Response',
      description: 'Standard API response structure',
      category: 'API',
      icon: Database,
      fields: [
        { id: generateId(), name: 'success', type: 'Number', value: 1 },
        { id: generateId(), name: 'message', type: 'String', value: 'Request successful' },
        { id: generateId(), name: 'statusCode', type: 'Number', value: 200 },
        { id: generateId(), name: 'timestamp', type: 'String', value: '2024-01-01T00:00:00Z' },
        {
          id: generateId(),
          name: 'data',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'id', type: 'Number', value: 1 },
            { id: generateId(), name: 'name', type: 'String', value: 'Sample Data' },
            { id: generateId(), name: 'value', type: 'String', value: 'Sample Value' }
          ]
        },
        {
          id: generateId(),
          name: 'pagination',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'page', type: 'Number', value: 1 },
            { id: generateId(), name: 'limit', type: 'Number', value: 10 },
            { id: generateId(), name: 'total', type: 'Number', value: 100 },
            { id: generateId(), name: 'hasNext', type: 'Number', value: 1 }
          ]
        }
      ]
    },
    {
      id: 'website-config',
      name: 'Website Configuration',
      description: 'Website configuration and settings',
      category: 'Configuration',
      icon: Globe,
      fields: [
        { id: generateId(), name: 'siteName', type: 'String', value: 'My Website' },
        { id: generateId(), name: 'description', type: 'String', value: 'Website description' },
        { id: generateId(), name: 'url', type: 'String', value: 'https://example.com' },
        { id: generateId(), name: 'language', type: 'String', value: 'en' },
        {
          id: generateId(),
          name: 'theme',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'primaryColor', type: 'String', value: '#007bff' },
            { id: generateId(), name: 'secondaryColor', type: 'String', value: '#6c757d' },
            { id: generateId(), name: 'darkMode', type: 'Number', value: 0 }
          ]
        },
        {
          id: generateId(),
          name: 'features',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'comments', type: 'Number', value: 1 },
            { id: generateId(), name: 'newsletter', type: 'Number', value: 1 },
            { id: generateId(), name: 'analytics', type: 'Number', value: 1 }
          ]
        }
      ]
    },
    {
      id: 'mobile-app-config',
      name: 'Mobile App Config',
      description: 'Mobile application configuration',
      category: 'Mobile',
      icon: Smartphone,
      fields: [
        { id: generateId(), name: 'appName', type: 'String', value: 'My Mobile App' },
        { id: generateId(), name: 'version', type: 'String', value: '1.0.0' },
        { id: generateId(), name: 'buildNumber', type: 'Number', value: 1 },
        {
          id: generateId(),
          name: 'api',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'baseUrl', type: 'String', value: 'https://api.example.com' },
            { id: generateId(), name: 'timeout', type: 'Number', value: 30000 },
            { id: generateId(), name: 'retries', type: 'Number', value: 3 }
          ]
        },
        {
          id: generateId(),
          name: 'features',
          type: 'Nested',
          children: [
            { id: generateId(), name: 'pushNotifications', type: 'Number', value: 1 },
            { id: generateId(), name: 'biometricAuth', type: 'Number', value: 1 },
            { id: generateId(), name: 'offlineMode', type: 'Number', value: 0 }
          ]
        }
      ]
    }
  ];

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleLoadTemplate = (template: Template) => {
    onLoadTemplate(template.fields);
    setIsOpen(false);
    toast.success(`Loaded template: ${template.name}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Template className="h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Template className="h-5 w-5" />
            Schema Templates
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] w-full">
          <div className="space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  {category}
                  <Badge variant="secondary">{templates.filter(t => t.category === category).length}</Badge>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates
                    .filter(template => template.category === category)
                    .map(template => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <template.icon className="h-5 w-5 text-purple-600" />
                              <CardTitle className="text-base">{template.name}</CardTitle>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleLoadTemplate(template)}
                              className="hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
                            >
                              Use Template
                            </Button>
                          </div>
                          <CardDescription className="text-sm">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{template.fields.length} fields</span>
                            <Badge variant="outline" className="text-xs">
                              {template.fields.filter(f => f.type === 'Nested').length} nested
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};