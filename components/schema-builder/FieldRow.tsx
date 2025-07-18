import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SchemaField, FieldRowProps } from '@/types/schema';
import { NestedFields } from './NestedFields';
import { generateId } from '@/lib/utils';

export const FieldRow: React.FC<FieldRowProps> = ({
  field,
  index,
  onUpdate,
  onDelete,
  onAddNested,
  level = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localField, setLocalField] = useState(field);

  const handleFieldChange = (updates: Partial<SchemaField>) => {
    const updatedField = { ...localField, ...updates };
    setLocalField(updatedField);
    onUpdate(index, updatedField);
  };

  const handleTypeChange = (newType: 'String' | 'Number' | 'Nested') => {
    let defaultValue: string | number | undefined;
    let children: SchemaField[] | undefined;

    if (newType === 'String') {
      defaultValue = 'Default String';
    } else if (newType === 'Number') {
      defaultValue = 0;
    } else if (newType === 'Nested') {
      children = [];
      defaultValue = undefined;
    }

    handleFieldChange({
      type: newType,
      value: defaultValue,
      children
    });
  };

  const handleNestedFieldsChange = (newChildren: SchemaField[]) => {
    handleFieldChange({ children: newChildren });
  };

  const addNestedField = () => {
    const newChild: SchemaField = {
      id: generateId(),
      name: `field_${(localField.children?.length || 0) + 1}`,
      type: 'String',
      value: 'Default String'
    };

    const updatedChildren = [...(localField.children || []), newChild];
    handleFieldChange({ children: updatedChildren });
  };

  const indentLevel = level * 24;

  return (
    <Card className="mb-4 transition-all duration-200 hover:shadow-md" style={{ marginLeft: `${indentLevel}px` }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {localField.type === 'Nested' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <div className="flex-1 flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Field name"
              value={localField.name}
              onChange={(e) => handleFieldChange({ name: e.target.value })}
              className="w-40 min-w-[160px]"
            />
            
            <Select value={localField.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Number">Number</SelectItem>
                <SelectItem value="Nested">Nested</SelectItem>
              </SelectContent>
            </Select>

            {localField.type === 'String' && (
              <Input
                placeholder="Default value"
                value={localField.value as string}
                onChange={(e) => handleFieldChange({ value: e.target.value })}
                className="w-40 min-w-[160px]"
              />
            )}

            {localField.type === 'Number' && (
              <Input
                type="number"
                placeholder="Default value"
                value={localField.value as number}
                onChange={(e) => handleFieldChange({ value: parseFloat(e.target.value) || 0 })}
                className="w-40 min-w-[160px]"
              />
            )}

            {localField.type === 'Nested' && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNestedField}
                className="flex items-center gap-1 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
              >
                <Plus className="h-4 w-4" />
                Add Field
              </Button>
            )}
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
            className="h-9 w-9 p-0 hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {localField.type === 'Nested' && isExpanded && localField.children && (
          <div className="mt-4 border-l-2 border-purple-200 dark:border-purple-800 pl-4 relative">
            <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-purple-400 to-blue-400 opacity-60"></div>
            <NestedFields
              fields={localField.children}
              onFieldsChange={handleNestedFieldsChange}
              level={level + 1}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};