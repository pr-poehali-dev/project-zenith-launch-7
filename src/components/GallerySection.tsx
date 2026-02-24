import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

const UPLOAD_URL = 'https://functions.poehali.dev/b2489f59-4d00-4724-9a89-0168ecb48d3c';

type Photo = { url: string; name: string };

export default function GallerySection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = Array.from(e.target.files ?? []);
    if (!fileList.length) return;
    setUploading(true);
    for (const file of fileList) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const b64 = (reader.result as string).split(',')[1];
          const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: b64,
              filename: file.name,
              contentType: file.type,
              folder: 'gallery',
            }),
          });
          const data = await res.json();
          setPhotos((prev) => [...prev, { url: data.url, name: file.name }]);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setUploading(false);
    e.target.value = '';
  }

  return (
    <section className="bg-white py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-5xl">

        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Галерея</p>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">Фотографии</h2>
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-full bg-black text-white py-3 px-6 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name={uploading ? 'Loader' : 'Plus'} size={16} />
            {uploading ? 'Загрузка...' : 'Добавить фото'}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </div>

        {photos.length === 0 ? (
          <div
            onClick={() => inputRef.current?.click()}
            className="rounded-2xl border-2 border-dashed border-gray-200 py-24 flex flex-col items-center gap-4 text-gray-400 cursor-pointer hover:border-gray-400 transition-colors"
          >
            <Icon name="ImagePlus" size={48} />
            <p className="text-sm">Нажмите, чтобы добавить первые фотографии</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-2xl cursor-pointer group relative"
                onClick={() => setLightbox(photo.url)}
              >
                <img
                  src={photo.url}
                  alt={photo.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Icon name="ZoomIn" size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
            <div
              onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Icon name="Plus" size={24} />
              <p className="text-xs">Добавить</p>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
            <Icon name="X" size={28} />
          </button>
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-xl object-contain" />
        </div>
      )}
    </section>
  );
}
