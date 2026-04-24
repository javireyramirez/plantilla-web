import { FileText, UploadCloud, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Aquí es donde conectarías con tu lógica de S3
    setFile(acceptedFiles[0]);
    console.log('Archivo listo para S3:', acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 cursor-pointer',
          'hover:bg-accent/50 hover:border-primary/50',
          isDragActive ? 'border-primary bg-accent' : 'border-muted-foreground/25'
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <UploadCloud className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive ? 'Suelta el archivo aquí' : 'Haz clic o arrastra una imagen'}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG hasta 10MB</p>
          </div>
        </div>
      </div>

      {/* Vista previa simple */}
      {file && (
        <div className="mt-4 p-4 border rounded-md flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm truncate max-w-[200px] font-medium">{file.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
