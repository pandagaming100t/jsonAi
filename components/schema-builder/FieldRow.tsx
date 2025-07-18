import React, { useState } from 'react';
import { Trash2, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { SchemaField, FieldRowProps } from '@/types/schema';
import { NestedFields } from './NestedFields';
import { generateId } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical } from 'lucide-react';

interface FieldRowProps {
  field: SchemaField;
  index: number;
  onUpdate: (index: number, field: SchemaField) => void;
  onDelete: (index: number) => void;
  onAddNested: (index: number) => void;
  level?: number;
}

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

  const fieldTypes = [
    'String', 'Number', 'Boolean', 'Array', 'Object', 'Date', 
    'Email', 'URL', 'UUID', 'Integer', 'Float', 'Enum', 'Nested'
  ];

  const getDefaultValue = () => {
    switch (localField.type) {
      case 'String':
      case 'Email':
      case 'URL':
      case 'UUID':
        return '';
      case 'Number':
      case 'Integer':
      case 'Float':
        return 0;
      case 'Boolean':
        return false;
      case 'Date':
        return new Date().toISOString().split('T')[0];
      case 'Array':
        return [];
      case 'Object':
      case 'Nested':
        return {};
      default:
        return '';
    }
  };

  const renderValueInput = () => {
    switch (localField.type) {
      case 'Boolean':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={localField.value as boolean}
              onChange={(checked) => handleFieldChange({value: checked})}
            />
            <span className="text-sm">Default: {localField.value ? 'true' : 'false'}</span>
          </div>
        );
      case 'Enum':
        return (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Comma-separated values (e.g., red,blue,green)"
              value={localField.enumValues?.join(',') || ''}
              onChange={(e) => handleFieldChange({enumValues: e.target.value.split(',').map(v => v.trim())})}
            />
            <Select value={localField.value as string} onValueChange={(value) => handleFieldChange({value: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select default value" />
              </SelectTrigger>
              <SelectContent>
                {localField.enumValues?.map((enumValue) => (
                  <SelectItem key={enumValue} value={enumValue}>
                    {enumValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'Array':
        return (
          <Select value={localField.arrayItemType || 'String'} onValueChange={(value) => handleFieldChange({arrayItemType: value})}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Array item type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="String">String</SelectItem>
              <SelectItem value="Number">Number</SelectItem>
              <SelectItem value="Boolean">Boolean</SelectItem>
              <SelectItem value="Object">Object</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'Date':
        return (
          <Input
            type="date"
            value={localField.value as string || ''}
            onChange={(e) => handleFieldChange({value: e.target.value})}
          />
        );
      case 'Number':
      case 'Integer':
      case 'Float':
        return (
          <div className="flex gap-2">
            <Input
              placeholder="Default value"
              type="number"
              value={localField.value?.toString() || ''}
              onChange={(e) => handleFieldChange({value: Number(e.target.value)})}
            />
            <Input
              placeholder="Min"
              type="number"
              value={localField.min?.toString() || ''}
              onChange={(e) => handleFieldChange({min: e.target.value ? Number(e.target.value) : undefined})}
            />
            <Input
              placeholder="Max"
              type="number"
              value={localField.max?.toString() || ''}
              onChange={(e) => handleFieldChange({max: e.target.value ? Number(e.target.value) : undefined})}
            />
          </div>
        );
      case 'Nested':
      case 'Object':
        return null;
      default:
        return (
          <div className="flex gap-2">
            <Input
              placeholder="Default value"
              value={localField.value?.toString() || ''}
              onChange={(e) => handleFieldChange({value: e.target.value})}
            />
            {(localField.type === 'String' || localField.type === 'Email' || localField.type === 'URL') && (
              <>
                <Input
                  placeholder="Min Length"
                  type="number"
                  value={localField.minLength?.toString() || ''}
                  onChange={(e) => handleFieldChange({minLength: e.target.value ? Number(e.target.value) : undefined})}
                />
                <Input
                  placeholder="Max Length"
                  type="number"
                  value={localField.maxLength?.toString() || ''}
                  onChange={(e) => handleFieldChange({maxLength: e.target.value ? Number(e.target.value) : undefined})}
                />
              </>
            )}
          </div>
        );
    }
  };

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
                {fieldTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={localField.required || false}
            onChange={(checked) => handleFieldChange({required: checked})}
          />
          <span className="text-sm">Required</span>
        </div>

            
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
            {localField.type !== 'Nested' && localField.type !== 'Object' && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Value Configuration:</label>
          {renderValueInput()}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Input
          placeholder="Description (optional)"
          value={localField.description || ''}
          onChange={(e) => handleFieldChange({description: e.target.value})}
        />
        {localField.type === 'String' && (
          <Input
            placeholder="Pattern (regex, optional)"
            value={localField.pattern || ''}
            onChange={(e) => handleFieldChange({pattern: e.target.value})}
          />
        )}
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