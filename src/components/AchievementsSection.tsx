import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { apiGet } from '@/lib/api';

const tabs = ['Мои достижения', 'Достижения воспитанников'];

const levelColor: Record<string, string> = {
  'Муниципальный': 'bg-blue-50 text-blue-600',
  'Региональный': 'bg-purple-50 text-purple-600',
  'Федеральный': 'bg-amber-50 text-amber-600',
  'Международный': 'bg-green-50 text-green-600',
};

export default function AchievementsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [achievements, setAchievements] = useState<Record<string, string>[]>([]);

  useEffect(() => {
    apiGet('achievements').then(setAchievements);
  }, []);

  const type = activeTab === 0 ? 'my' : 'kids';
  const items = achievements.filter((a) => a.type === type);

  return (
    <section className="bg-white py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-5xl">

        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Портфолио достижений</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">Результаты и награды</h2>
        </div>

        <div className="flex gap-2 mb-10 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={cn(
                'px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === index ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm px-8 py-6 flex flex-col sm:flex-row gap-6 items-start border border-gray-100">
              <div className="shrink-0 w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                {item.year}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <p className="text-gray-900 font-medium">{item.title}</p>
                  <span className={cn('text-xs rounded-full px-3 py-1 font-medium', levelColor[item.level] ?? 'bg-gray-100 text-gray-500')}>
                    {item.level}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <Icon name="Award" size={20} className="text-gray-200 shrink-0 mt-1" />
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">Достижения пока не добавлены</div>
          )}
        </div>

      </div>
    </section>
  );
}
