import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

const UPLOAD_URL = 'https://functions.poehali.dev/b2489f59-4d00-4724-9a89-0168ecb48d3c';

const tabs = [
  { id: 'programs', label: 'Программы и планирование' },
  { id: 'presentations', label: 'Мои презентации' },
  { id: 'parents', label: 'Взаимодействие с родителями' },
  { id: 'consultations', label: 'Консультации для родителей' },
];

type FileItem = {
  name: string;
  url: string;
  size: string;
};

type FilesState = Record<string, FileItem[]>;

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'FileText';
  if (['ppt', 'pptx'].includes(ext ?? '')) return 'Presentation';
  if (['doc', 'docx'].includes(ext ?? '')) return 'FileText';
  return 'File';
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' Б';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
  return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
}

export default function MethodsSection() {
  const [activeTab, setActiveTab] = useState('programs');
  const [files, setFiles] = useState<FilesState>({ programs: [], presentations: [], parents: [], consultations: [] });
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
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
            folder: `methods/${activeTab}`,
          }),
        });
        const data = await res.json();
        setFiles((prev) => ({
          ...prev,
          [activeTab]: [
            ...prev[activeTab],
            { name: file.name, url: data.url, size: formatSize(file.size) },
          ],
        }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
    }
    e.target.value = '';
  }

  const currentFiles = files[activeTab] ?? [];

  return (
    <section className="bg-gray-50 py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-5xl">

        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Методические разработки</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">Мои материалы</h2>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {currentFiles.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 py-16 flex flex-col items-center gap-3 text-gray-400">
              <Icon name="FolderOpen" size={40} />
              <p className="text-sm">Файлы ещё не добавлены</p>
            </div>
          )}

          {currentFiles.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm px-6 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                <Icon name={fileIcon(f.name)} size={20} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 text-sm font-medium truncate">{f.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{f.size}</p>
              </div>
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-gray-400 hover:text-black transition-colors"
              >
                <Icon name="Download" size={18} />
              </a>
            </div>
          ))}

          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-black text-white py-4 px-6 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name={uploading ? 'Loader' : 'Upload'} size={18} />
            {uploading ? 'Загрузка...' : 'Прикрепить файл'}
          </button>
          <input ref={inputRef} type="file" className="hidden" onChange={handleUpload} />
        </div>

      </div>
    </section>
  );
}
