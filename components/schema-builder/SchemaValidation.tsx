import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SchemaField } from '@/types/schema';
import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface SchemaValidationProps {
  fields: SchemaField[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const SchemaValidation: React.FC<SchemaValidationProps> = ({ fields }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const validateJsonAgainstSchema = (jsonData: any, schemaFields: SchemaField[], path: string = ''): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const validateField = (data: any, field: SchemaField, currentPath: string) => {
      const fieldPath = currentPath ? `${currentPath}.${field.name}` : field.name;

      if (!(field.name in data)) {
        errors.push(`Missing required field: ${fieldPath}`);
        return;
      }

      const value = data[field.name];

      if (field.type === 'String') {
        if (typeof value !== 'string') {
          errors.push(`Field ${fieldPath} should be a string, got ${typeof value}`);
        } else if (value.length === 0) {
          warnings.push(`Field ${fieldPath} is an empty string`);
        }
      } else if (field.type === 'Number') {
        if (typeof value !== 'number') {
          errors.push(`Field ${fieldPath} should be a number, got ${typeof value}`);
        } else if (!Number.isFinite(value)) {
          errors.push(`Field ${fieldPath} should be a finite number`);
        }
      } else if (field.type === 'Nested') {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
          errors.push(`Field ${fieldPath} should be an object, got ${typeof value}`);
        } else if (field.children) {
          const nestedResult = validateJsonAgainstSchema(value, field.children, fieldPath);
          errors.push(...nestedResult.errors);
          warnings.push(...nestedResult.warnings);
        }
      }
    };

    if (typeof jsonData !== 'object' || jsonData === null || Array.isArray(jsonData)) {
      errors.push('Root data should be an object');
      return { isValid: false, errors, warnings };
    }

    schemaFields.forEach(field => validateField(jsonData, field, path));

    // Check for extra fields
    Object.keys(jsonData).forEach(key => {
      const fieldExists = schemaFields.some(field => field.name === key);
      if (!fieldExists) {
        warnings.push(`Extra field found: ${path ? `${path}.${key}` : key}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  };

  const handleValidation = () => {
    if (!jsonInput.trim()) {
      toast.error('Please enter JSON data to validate');
      return;
    }

    try {
      const jsonData = JSON.parse(jsonInput);
      const result = validateJsonAgainstSchema(jsonData, fields);
      setValidationResult(result);
      
      if (result.isValid) {
        toast.success('JSON is valid!');
      } else {
        toast.error(`Validation failed with ${result.errors.length} error(s)`);
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: ['Invalid JSON format'],
        warnings: []
      });
      toast.error('Invalid JSON format');
    }
  };

  const generateSampleJson = () => {
    const generateSample = (fields: SchemaField[]): any => {
      const result: any = {};
      fields.forEach(field => {
        if (field.type === 'Nested' && field.children) {
          result[field.name] = generateSample(field.children);
        } else {
          result[field.name] = field.value;
        }
      });
      return result;
    };

    const sample = generateSample(fields);
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Validate JSON
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            JSON Schema Validation
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Enter JSON data to validate against your schema
            </p>
            <Button variant="outline" size="sm" onClick={generateSampleJson}>
              Generate Sample
            </Button>
          </div>
          
          <Textarea
            placeholder="Enter your JSON data here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
          
          <div className="flex gap-2">
            <Button onClick={handleValidation}>
              Validate JSON
            </Button>
            <Button variant="outline" onClick={() => setJsonInput('')}>
              Clear
            </Button>
          </div>
          
          {validationResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <Badge variant="default" className="bg-green-500">Valid</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <Badge variant="destructive">Invalid</Badge>
                  </>
                )}
                <span className="text-sm text-muted-foreground">
                  {validationResult.errors.length} error(s), {validationResult.warnings.length} warning(s)
                </span>
              </div>
              
              {(validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
                <ScrollArea className="h-48 w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {validationResult.errors.map((error, index) => (
                      <div key={`error-${index}`} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                      </div>
                    ))}
                    {validationResult.warnings.map((warning, index) => (
                      <div key={`warning-${index}`} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-yellow-600 dark:text-yellow-400">{warning}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};