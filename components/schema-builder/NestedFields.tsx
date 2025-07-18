import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchemaField, SchemaBuilderProps } from '@/types/schema';
import { FieldRow } from './FieldRow';
import { generateId } from '@/lib/utils';

export const NestedFields: React.FC<SchemaBuilderProps> = ({
  fields,
  onFieldsChange,
  level = 0
}) => {
  const addField = () => {
    const newField: SchemaField = {
      id: generateId(),
      name: `field_${fields.length + 1}`,
      type: 'String',
      value: 'Default String'
    };
    onFieldsChange([...fields, newField]);
  };

  const updateField = (index: number, updatedField: SchemaField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    onFieldsChange(newFields);
  };

  const deleteField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    onFieldsChange(newFields);
  };

  const addNestedField = (index: number) => {
    const newFields = [...fields];
    if (newFields[index].type === 'Nested') {
      const newChild: SchemaField = {
        id: generateId(),
        name: `nested_field_${(newFields[index].children?.length || 0) + 1}`,
        type: 'String',
        value: 'Default String'
      };
      
      newFields[index].children = [...(newFields[index].children || []), newChild];
      onFieldsChange(newFields);
    }
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <FieldRow
          key={field.id}
          field={field}
          index={index}
          onUpdate={updateField}
          onDelete={deleteField}
          onAddNested={addNestedField}
          level={level}
        />
      ))}
      
      <Button
        variant="outline"
        onClick={addField}
        className="w-full flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Add Field
      </Button>
    </div>
  );
};