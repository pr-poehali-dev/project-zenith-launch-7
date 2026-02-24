import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { login, logout, checkAuth, apiGet, apiSave, apiCreate, apiDelete, uploadFile } from '@/lib/api';

const LEVELS = ['Муниципальный', 'Региональный', 'Федеральный', 'Международный'];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Data
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [portfolioProfile, setPortfolioProfile] = useState<Record<string, string>[]>([]);
  const [qualifications, setQualifications] = useState<Record<string, string>[]>([]);
  const [achievements, setAchievements] = useState<Record<string, string>[]>([]);
  const [methodsFiles, setMethodsFiles] = useState<Record<string, string>[]>([]);
  const [gallery, setGallery] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    checkAuth().then((ok) => {
      setAuthed(ok);
      setLoading(false);
      if (ok) loadAll();
    });
  }, []);

  async function loadAll() {
    const [p, pp, q, a, mf, g] = await Promise.all([
      apiGet('profile'),
      apiGet('portfolio_profile'),
      apiGet('qualifications'),
      apiGet('achievements'),
      apiGet('methods_files'),
      apiGet('gallery'),
    ]);
    setProfile(p);
    setPortfolioProfile(pp);
    setQualifications(q);
    setAchievements(a);
    setMethodsFiles(mf);
    setGallery(g);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(password);
    if (ok) { setAuthed(true); loadAll(); }
    else setLoginError('Неверный пароль');
  }

  async function handleLogout() {
    await logout();
    setAuthed(false);
  }

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function saveProfile() {
    setSaving(true);
    await apiSave('profile', { data: profile });
    setSaving(false);
    showSaved();
  }

  async function savePortfolioRow(id: number, value: string) {
    await apiSave('portfolio_profile', { id, value });
    showSaved();
  }

  async function addQual() {
    const row = await apiCreate('qualifications', { year: '2024', title: 'Новый курс', org: 'Организация', hours: '72 часа' });
    setQualifications((p) => [...p, row]);
  }

  async function saveQual(item: Record<string, string>) {
    await apiSave('qualifications', item);
    showSaved();
  }

  async function deleteQual(id: number) {
    await apiDelete('qualifications', id);
    setQualifications((p) => p.filter((x) => x.id !== id));
  }

  async function addAchievement(type: 'my' | 'kids') {
    const row = await apiCreate('achievements', { type, year: '2024', title: 'Новое достижение', description: 'Описание', level: 'Муниципальный' });
    setAchievements((p) => [...p, row]);
  }

  async function saveAchievement(item: Record<string, string>) {
    await apiSave('achievements', item);
    showSaved();
  }

  async function deleteAchievement(id: number) {
    await apiDelete('achievements', id);
    setAchievements((p) => p.filter((x) => x.id !== id));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, tabId: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `methods/${tabId}`);
    const size = file.size < 1024 * 1024 ? (file.size / 1024).toFixed(1) + ' КБ' : (file.size / (1024 * 1024)).toFixed(1) + ' МБ';
    const row = await apiCreate('methods_files', { tab: tabId, name: file.name, url, size });
    setMethodsFiles((p) => [row, ...p]);
    e.target.value = '';
  }

  async function deleteFile(id: number) {
    await apiDelete('methods_files', id);
    setMethodsFiles((p) => p.filter((x) => x.id !== id));
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, 'gallery');
    const row = await apiCreate('gallery', { url, name: file.name });
    setGallery((p) => [row, ...p]);
    e.target.value = '';
  }

  async function deletePhoto(id: number) {
    await apiDelete('gallery', id);
    setGallery((p) => p.filter((x) => x.id !== id));
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Icon name="Loader" size={32} className="animate-spin text-gray-400" />
    </div>
  );

  if (!authed) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-light text-gray-900">Панель администратора</h1>
          <p className="text-gray-400 text-sm mt-2">Введите пароль для входа</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors"
          />
          {loginError && <p className="text-red-500 text-xs">{loginError}</p>}
          <button type="submit" className="bg-black text-white rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity">
            Войти
          </button>
        </form>
      </div>
    </div>
  );

  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'portfolio', label: 'Анкета' },
    { id: 'qualifications', label: 'Квалификация' },
    { id: 'achievements', label: 'Достижения' },
    { id: 'methods', label: 'Материалы' },
    { id: 'gallery', label: 'Галерея' },
  ];

  const methodTabs = [
    { id: 'programs', label: 'Программы и планирование' },
    { id: 'presentations', label: 'Мои презентации' },
    { id: 'parents', label: 'Взаимодействие с родителями' },
    { id: 'consultations', label: 'Консультации для родителей' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon name="Settings" size={20} className="text-gray-400" />
          <h1 className="text-base font-medium text-gray-900">Панель администратора</h1>
        </div>
        <div className="flex items-center gap-4">
          {saved && <span className="text-green-600 text-sm">Сохранено!</span>}
          <a href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">Сайт →</a>
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-500 transition-colors">Выйти</button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-56 min-h-screen bg-white border-r border-gray-100 pt-6 px-3 shrink-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'w-full text-left px-4 py-2.5 rounded-xl text-sm mb-1 transition-colors',
                tab === t.id ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-8 max-w-3xl">

          {/* PROFILE */}
          {tab === 'profile' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-medium text-gray-900">Основной профиль</h2>
              {[
                { key: 'name', label: 'ФИО' },
                { key: 'title', label: 'Должность / специализация' },
                { key: 'bio', label: 'Короткое bio (hero)' },
                { key: 'experience', label: 'Лет опыта' },
                { key: 'about_text', label: 'О себе — абзац 1' },
                { key: 'about_text2', label: 'О себе — абзац 2' },
                { key: 'about_text3', label: 'О себе — абзац 3' },
                { key: 'motto', label: 'Девиз (цитата)' },
                { key: 'telegram', label: 'Ссылка Telegram' },
                { key: 'vk', label: 'Ссылка ВКонтакте' },
                { key: 'instagram', label: 'Ссылка Instagram' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs uppercase tracking-widest text-gray-400 mb-1 block">{label}</label>
                  <textarea
                    rows={key.startsWith('about') || key === 'bio' ? 3 : 1}
                    value={profile[key] || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-colors resize-none"
                  />
                </div>
              ))}
              <button onClick={saveProfile} disabled={saving}
                className="self-start bg-black text-white rounded-xl px-8 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          )}

          {/* PORTFOLIO PROFILE */}
          {tab === 'portfolio' && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-gray-900">Анкетные данные</h2>
              {portfolioProfile.map((row) => (
                <div key={row.id} className="bg-white rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                  <label className="text-xs uppercase tracking-widest text-gray-400">{row.label}</label>
                  <input
                    value={row.value}
                    onChange={(e) => setPortfolioProfile((p) => p.map((r) => r.id === row.id ? { ...r, value: e.target.value } : r))}
                    onBlur={() => savePortfolioRow(row.id, row.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black transition-colors"
                  />
                </div>
              ))}
            </div>
          )}

          {/* QUALIFICATIONS */}
          {tab === 'qualifications' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900">Повышение квалификации</h2>
                <button onClick={addQual} className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2 text-sm hover:opacity-90 transition-opacity">
                  <Icon name="Plus" size={16} /> Добавить
                </button>
              </div>
              {qualifications.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Год</label>
                      <input value={item.year} onChange={(e) => setQualifications((p) => p.map((r) => r.id === item.id ? { ...r, year: e.target.value } : r))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Часов</label>
                      <input value={item.hours} onChange={(e) => setQualifications((p) => p.map((r) => r.id === item.id ? { ...r, hours: e.target.value } : r))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Название курса</label>
                    <input value={item.title} onChange={(e) => setQualifications((p) => p.map((r) => r.id === item.id ? { ...r, title: e.target.value } : r))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Организация</label>
                    <input value={item.org} onChange={(e) => setQualifications((p) => p.map((r) => r.id === item.id ? { ...r, org: e.target.value } : r))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => saveQual(item)} className="bg-black text-white rounded-lg px-4 py-2 text-xs hover:opacity-90">Сохранить</button>
                    <button onClick={() => deleteQual(item.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Icon name="Trash2" size={14} /> Удалить</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS */}
          {tab === 'achievements' && (
            <div className="flex flex-col gap-6">
              {(['my', 'kids'] as const).map((type) => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-gray-900">{type === 'my' ? 'Мои достижения' : 'Достижения воспитанников'}</h2>
                    <button onClick={() => addAchievement(type)} className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2 text-sm hover:opacity-90 transition-opacity">
                      <Icon name="Plus" size={16} /> Добавить
                    </button>
                  </div>
                  {achievements.filter((a) => a.type === type).map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3 mb-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Год</label>
                          <input value={item.year} onChange={(e) => setAchievements((p) => p.map((r) => r.id === item.id ? { ...r, year: e.target.value } : r))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Уровень</label>
                          <select value={item.level} onChange={(e) => setAchievements((p) => p.map((r) => r.id === item.id ? { ...r, level: e.target.value } : r))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black bg-white">
                            {LEVELS.map((l) => <option key={l}>{l}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Название</label>
                        <input value={item.title} onChange={(e) => setAchievements((p) => p.map((r) => r.id === item.id ? { ...r, title: e.target.value } : r))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Описание</label>
                        <input value={item.description} onChange={(e) => setAchievements((p) => p.map((r) => r.id === item.id ? { ...r, description: e.target.value } : r))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-black" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => saveAchievement(item)} className="bg-black text-white rounded-lg px-4 py-2 text-xs hover:opacity-90">Сохранить</button>
                        <button onClick={() => deleteAchievement(item.id)} className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1"><Icon name="Trash2" size={14} /> Удалить</button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* METHODS */}
          {tab === 'methods' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-medium text-gray-900">Методические материалы</h2>
              {methodTabs.map((mt) => {
                const files = methodsFiles.filter((f) => f.tab === mt.id);
                return (
                  <div key={mt.id} className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900 text-sm">{mt.label}</h3>
                      <label className="flex items-center gap-2 bg-black text-white rounded-lg px-3 py-2 text-xs cursor-pointer hover:opacity-90 transition-opacity">
                        <Icon name="Upload" size={14} /> Загрузить
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, mt.id)} />
                      </label>
                    </div>
                    {files.length === 0 && <p className="text-gray-400 text-sm">Файлов нет</p>}
                    {files.map((f) => (
                      <div key={f.id} className="flex items-center gap-3 py-2 border-t border-gray-100">
                        <Icon name="FileText" size={16} className="text-gray-400 shrink-0" />
                        <a href={f.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm text-gray-700 hover:text-black truncate">{f.name}</a>
                        <span className="text-xs text-gray-400 shrink-0">{f.size}</span>
                        <button onClick={() => deleteFile(f.id)} className="text-red-300 hover:text-red-500"><Icon name="X" size={16} /></button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}

          {/* GALLERY */}
          {tab === 'gallery' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-900">Галерея</h2>
                <label className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2 text-sm cursor-pointer hover:opacity-90 transition-opacity">
                  <Icon name="Plus" size={16} /> Добавить фото
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {gallery.map((photo) => (
                  <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden">
                    <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}