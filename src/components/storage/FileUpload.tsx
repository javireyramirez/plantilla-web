import { FileText, UploadCloud, X } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useUploadFile } from '@/hooks/use-storage';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  entityType: string;
  entityId: string;
  onSuccess?: () => void;
}

export function FileUpload({ entityType, entityId, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const { isPending: isPendingUpload, mutate: mutateUpload } = useUploadFile();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: isPendingUpload,
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.oasis.opendocument.text': ['.odt'],
      'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
      'application/vnd.oasis.opendocument.presentation': ['.odp'],
      'text/plain': ['.txt'],
      'text/csv': ['.csv'],
    },
  });

  const handleUpload = () => {
    if (!file) return;

    mutateUpload(
      { entityType, entityId, file },
      {
        onSuccess: () => {
          toast.success('Documento subido con éxito');
          setFile(null); // limpia tras subir
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error?.message || 'Error al subir el documento');
        },
      }
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 cursor-pointer',
          'hover:bg-accent/50 hover:border-primary/50',
          isDragActive ? 'border-primary bg-accent' : 'border-muted-foreground/25',
          isPendingUpload && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <UploadCloud className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? 'Suelta el archivo aquí' : 'Haz clic o arrastra un archivo'}
            </p>
            <p className="text-xs text-muted-foreground">Máximo 5MB</p>
          </div>
        </div>
      </div>

      {file && (
        <div className="mt-4 p-4 border rounded-md flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm truncate max-w-[200px] font-medium">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFile(null)}
            disabled={isPendingUpload}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {file && (
        <Button className="mt-3 w-full" onClick={handleUpload} disabled={isPendingUpload}>
          {isPendingUpload ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            'Subir documento'
          )}
        </Button>
      )}
    </div>
  );
}
