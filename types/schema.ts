export interface SchemaField {
  id: string;
  name: string;
  type: 'String' | 'Number' | 'Nested';
  value?: string | number;
  children?: SchemaField[];
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