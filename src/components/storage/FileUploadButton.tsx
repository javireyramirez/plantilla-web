import { LoaderCircle, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { FileUploadConfigProps, useFileUploadLogic } from './useFileUploadLogic';

interface FileUploadButtonProps extends Omit<FileUploadConfigProps, 'autoUpload'> {
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FileUploadButton({
  label = 'Subir archivo',
  variant = 'default',
  size = 'default',
  ...props
}: FileUploadButtonProps) {
  const { getRootProps, getInputProps, isPendingUpload } = useFileUploadLogic({
    ...props,
    autoUpload: true, // Forzamos a true para que el botón sea inmediato
  });

  return (
    <div {...getRootProps()} className="inline-block">
      {/* Ocultamos el input pero permitimos que Dropzone lo maneje */}
      <input {...getInputProps()} />
      <Button type="button" variant={variant} size={size} disabled={isPendingUpload}>
        {isPendingUpload ? (
          <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Upload className="w-4 h-4 mr-2" />
        )}
        {isPendingUpload ? 'Subiendo...' : label}
      </Button>
    </div>
  );
}
