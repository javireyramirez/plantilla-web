import { FileText, LoaderCircle, UploadCloud, X } from 'lucide-react';
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
  multiple?: boolean;
  autoUpload?: boolean;
}

export function FileUpload({
  entityType,
  entityId,
  onSuccess,
  multiple = false,
  autoUpload = false,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const { isPending: isPendingUpload, mutate: mutateUpload } = useUploadFile();

  // 1. Extraemos la lógica de subida para poder reutilizarla
  const executeUpload = useCallback(
    (filesToUpload: File[]) => {
      if (filesToUpload.length === 0) return;

      const payload = multiple
        ? { entityType, entityId, files: filesToUpload }
        : { entityType, entityId, file: filesToUpload[0] };

      // Cast temporal a 'any' para evitar problemas con la firma estricta de tu hook
      mutateUpload(payload as any, {
        onSuccess: () => {
          toast.success(
            multiple && filesToUpload.length > 1
              ? 'Documentos subidos con éxito'
              : 'Documento subido con éxito'
          );
          setFiles([]);
          onSuccess?.();
        },
        onError: (error) => {
          console.log(error?.message);
          toast.error('Error al subir el documento');
        },
      });
    },
    [multiple, entityType, entityId, mutateUpload, onSuccess]
  );

  // 2. Modificamos onDrop para que dispare la subida si autoUpload es true
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      let currentFiles = acceptedFiles;

      if (multiple) {
        setFiles((prev) => {
          currentFiles = [...prev, ...acceptedFiles];
          return currentFiles;
        });
      } else {
        setFiles([acceptedFiles[0]]);
        currentFiles = [acceptedFiles[0]];
      }

      // Si está activada la subida automática, la ejecutamos inmediatamente
      if (autoUpload) {
        executeUpload(currentFiles);
      }
    },
    [multiple, autoUpload, executeUpload]
  );

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
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
              {isDragActive
                ? 'Suelta los archivos aquí'
                : multiple
                  ? 'Haz clic o arrastra los archivos'
                  : 'Haz clic o arrastra un archivo'}
            </p>
            <p className="text-xs text-muted-foreground">Máximo 5MB por archivo</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="p-4 border rounded-md flex items-center justify-between bg-card"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm truncate font-medium">{file.name}</span>
              </div>

              {/* Si está subiendo automáticamente, mostramos un spinner en lugar del botón de borrar */}
              {isPendingUpload && autoUpload ? (
                <LoaderCircle className="w-4 h-4 text-muted-foreground animate-spin shrink-0" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  disabled={isPendingUpload}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Ocultamos el botón de subida si autoUpload es true */}
      {!autoUpload && files.length > 0 && (
        <Button
          className="mt-3 w-full"
          onClick={() => executeUpload(files)}
          disabled={isPendingUpload}
        >
          {isPendingUpload ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : multiple && files.length > 1 ? (
            `Subir ${files.length} documentos`
          ) : (
            'Subir documento'
          )}
        </Button>
      )}
    </div>
  );
}
