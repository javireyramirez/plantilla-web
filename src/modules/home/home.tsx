import { FileUploadButton } from '@/components/storage/FileUploadButton';
import { FileUploadZone } from '@/components/storage/FileUploadZone';

// Ajusta la ruta

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-6 p-10">
      <h1 className="text-xl font-bold">Gestión de Archivos</h1>

      <FileUploadZone
        entityType="hola"
        entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1"
        autoUpload={true}
        multiple={true}
      />

      <FileUploadButton
        entityType="hola"
        entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1"
        multiple={true}
      />
    </div>
  );
}
