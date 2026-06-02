import { FileUploadButton } from '@/components/storage/FileUploadButton';
import { FileUploadZone } from '@/components/storage/FileUploadZone';

// Ajusta la ruta

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-10">
      <h1 className="text-xl font-bold">Gestión de Archivos</h1>

      <FileUploadZone
        entityType="companies"
        entityId="019e8513-5fba-7b2c-a424-01425e6ea9b7"
        autoUpload={true}
        multiple={true}
      />

      <FileUploadButton
        entityType="companies"
        entityId="019e8513-5fba-7b2c-a424-01425e6ea9b7"
        multiple={true}
      />
    </div>
  );
}
