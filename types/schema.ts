export interface SchemaField {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Boolean' | 'Array' | 'Object' | 'Date' | 'Email' | 'URL' | 'UUID' | 'Integer' | 'Float' | 'Enum' | 'Nested';
  value?: string | number | boolean;
  children?: SchemaField[];
  enumValues?: string[];
  arrayItemType?: string;
  required?: boolean;
  description?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface SavedSchema {
  _id: string;
  name: string;
  schema: SchemaField[];
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface SchemaBuilderProps {
  fields: SchemaField[];
  onFieldsChange: (fields: SchemaField[]) => void;
  level?: number;
}

export interface FieldRowProps {
  field: SchemaField;
  index: number;
  onUpdate: (index: number, field: SchemaField) => void;
  onDelete: (index: number) => void;
  onAddNested: (index: number) => void;
  level?: number;
}