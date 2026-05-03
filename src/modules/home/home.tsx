'use client'; // Importante si usas Next.js App Router
import { useEffect, useState } from 'react';

import { FileUploadButton } from '@/components/storage/FileUploadButton';
import { FileUploadZone } from '@/components/storage/FileUploadZone';
import { useGetDocuments } from '@/hooks/use-storage';

// Ajusta la ruta

export default function Home() {
  // 1. Estados para la paginación y filtros
  const [page, setPage] = useState(1);
  const limit = 5;

  // 2. Llamada al hook
  const { data, isLoading, isError } = useGetDocuments(
    'hola',
    'b13ce02f-5bae-424f-80ad-74f47bec5ba1',
    false, // isTrash
    page,
    limit,
    '', // fileName
    'application/pdf' // contentType
  );

  const hasNextPage = data?.meta?.totalPages ? page < data.meta.totalPages : false;

  // 3. Console log para ver qué llega del back
  useEffect(() => {
    if (data) {
      console.log('Documentos cargados:', data.documents);
      console.log('Meta información:', data.meta);
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-10">
      <h1 className="text-xl font-bold">Gestión de Archivos</h1>

      <FileUploadZone
        entityType="hola"
        entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1"
        autoUpload={true}
        multiple={true}
      />

      {/* 4. Renderizado de la lista y paginación */}
      <div className="w-full max-w-md border rounded p-4 bg-gray-50">
        <h2 className="mb-4 font-semibold">Lista de Documentos:</h2>

        {isLoading && <p>Cargando documentos...</p>}
        {isError && <p className="text-red-500">Error al cargar</p>}

        <ul className="space-y-2">
          {data?.documents.map((doc: any) => (
            <li key={doc.id} className="text-sm border-b pb-1">
              {doc.fileName} - <span className="text-gray-500">{doc.contentType}</span>
            </li>
          ))}
        </ul>

        {/* 5. Controles de Paginación */}
        <div className="flex gap-4">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>

          <span>
            Página {page} de {data?.meta?.totalPages || 1}
          </span>

          <button
            disabled={!hasNextPage} // Se bloquea si es la última página
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>

      <FileUploadButton
        entityType="hola"
        entityId="b13ce02f-5bae-424f-80ad-74f47bec5ba1"
        multiple={true}
      />
    </div>
  );
}
