import { FileUploadButton } from '@/components/storage/FileUploadButton';
import { FileUploadZone } from '@/components/storage/FileUploadZone';
import { DataTable } from '@/components/table/DataTable';
import { columns } from '@/components/table/colums';

export default function Home() {
  const data = [
    { id: '1', nombre: 'Carlos', email: 'carlos@ejemplo.com', estado: 'activo' },
    { id: '2', nombre: 'Ana', email: 'ana@ejemplo.com', estado: 'inactivo' },
    // ... más datos
  ];
  return (
    <div className="flex flex-col justify-center items-center gap-6">
      Página genérica de aplicación genérica que es responsive en teléfonosfadhdfh
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
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={data} searchKey="nombre" />
      </div>
    </div>
  );
}
