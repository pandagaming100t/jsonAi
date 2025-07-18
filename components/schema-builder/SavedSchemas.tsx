import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedSchema } from '@/types/schema';
import { FolderOpen, Calendar, RefreshCw } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface SavedSchemasProps {
  schemas: SavedSchema[];
  onLoad: (schema: SavedSchema) => void;
  onRefresh: () => void;
}

export const SavedSchemas: React.FC<SavedSchemasProps> = ({
  schemas,
  onLoad,
  onRefresh
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Saved Schemas
        </CardTitle>
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-250px)] w-full">
          {schemas.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No saved schemas</p>
              <p className="text-sm">Create and save your first schema to see it here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schemas.map((schema) => (
                <Card key={schema._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{schema.name}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onLoad(schema)}
                        className="hover:bg-purple-50 hover:border-purple-200 dark:hover:bg-purple-900/20"
                      >
                        Load
                      </Button>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created: {formatDate(new Date(schema.createdAt))}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {schema.schema.length} field{schema.schema.length !== 1 ? 's' : ''}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};