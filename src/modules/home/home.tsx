import { FileUpload } from '@/components/storage/FileUpload';

export default function Home() {
  return (
    <div className="flex justify-center">
      Página genérica de aplicación genérica que es responsive en teléfonosfadhdfh
      <FileUpload
        entityType="hola"
        entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1"
        autoUpload={true}
        multiple={true}
      />
    </div>
  );
}
