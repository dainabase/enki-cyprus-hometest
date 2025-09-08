import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AIImportDocument } from '@/lib/ai-import/types';
import { supabase } from '@/integrations/supabase/client';

interface AIImportDropzoneProps {
  onDocumentsChange: (documents: AIImportDocument[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const AIImportDropzone: React.FC<AIImportDropzoneProps> = ({
  onDocumentsChange,
  onAnalyze,
  isAnalyzing
}) => {
  const [documents, setDocuments] = useState<AIImportDocument[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newDocuments: AIImportDocument[] = acceptedFiles.map(file => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'pending'
    }));

    const updatedDocuments = [...documents, ...newDocuments];
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
  }, [documents, onDocumentsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const removeDocument = (id: string) => {
    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    onDocumentsChange(updatedDocuments);
  };

  const uploadDocument = async (document: AIImportDocument) => {
    try {
      setDocuments(prev => prev.map(doc => 
        doc.id === document.id ? { ...doc, status: 'uploading' } : doc
      ));

      const fileExt = document.name.split('.').pop();
      const fileName = `${document.id}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('project-documents')
        .upload(fileName, document.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const updatedDoc = {
        ...document,
        status: 'uploaded' as const,
        uploadUrl: data.path
      };

      setDocuments(prev => prev.map(doc => 
        doc.id === document.id ? updatedDoc : doc
      ));

      onDocumentsChange(documents.map(doc => 
        doc.id === document.id ? updatedDoc : doc
      ));

    } catch (error) {
      console.error('Upload error:', error);
      setDocuments(prev => prev.map(doc => 
        doc.id === document.id ? { 
          ...doc, 
          status: 'error',
          error: 'Upload failed'
        } : doc
      ));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: AIImportDocument['status']) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'uploading':
        return <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />;
      default:
        return <File className="h-4 w-4 text-gray-600" />;
    }
  };

  const canAnalyze = documents.length > 0 && documents.every(doc => 
    doc.status === 'uploaded' || doc.status === 'pending'
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg">Déposez les fichiers PDF ici...</p>
            ) : (
              <>
                <p className="text-lg mb-2">Glissez-déposez vos documents PDF ici</p>
                <p className="text-sm text-gray-500">ou cliquez pour sélectionner</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {documents.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Documents ajoutés ({documents.length})</h3>
            <div className="space-y-3">
              {documents.map(document => (
                <div key={document.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(document.status)}
                    <div>
                      <p className="font-medium">{document.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(document.size)}
                        {document.status === 'error' && document.error && (
                          <span className="text-red-600 ml-2">• {document.error}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {document.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uploadDocument(document)}
                      >
                        Upload
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeDocument(document.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button
                onClick={onAnalyze}
                disabled={!canAnalyze || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyse en cours...
                  </>
                ) : (
                  'Analyser avec l\'IA'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};