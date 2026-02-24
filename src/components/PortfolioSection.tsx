import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['Анкетные данные', 'Повышение квалификации'];

const profileData = [
  { label: 'ФИО', value: 'Олзоева Елена Борисовна' },
  { label: 'Должность', value: 'Воспитатель' },
  { label: 'Место работы', value: 'Указать учреждение' },
  { label: 'Образование', value: 'Указать образование' },
  { label: 'Специальность по диплому', value: 'Указать специальность' },
  { label: 'Стаж педагогической работы', value: '5 лет' },
  { label: 'Квалификационная категория', value: 'Указать категорию' },
  { label: 'Дата последней аттестации', value: 'Указать дату' },
];

const qualifications = [
  {
    year: '2024',
    title: 'Название курса или программы',
    org: 'Название организации',
    hours: '72 часа',
  },
  {
    year: '2023',
    title: 'Название курса или программы',
    org: 'Название организации',
    hours: '36 часов',
  },
  {
    year: '2022',
    title: 'Название курса или программы',
    org: 'Название организации',
    hours: '108 часов',
  },
];

export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="bg-gray-50 py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-5xl">

        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Портфолио</p>
          <h2 className="text-3xl md:text-4xl font-light text-gray-900">Профессиональные сведения</h2>
        </div>

        <div className="flex gap-2 mb-10 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={cn(
                'px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-px',
                activeTab === index
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {profileData.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-center gap-2 px-8 py-5',
                  index !== profileData.length - 1 && 'border-b border-gray-100'
                )}
              >
                <p className="text-xs uppercase tracking-widest text-gray-400 sm:w-64 shrink-0">{item.label}</p>
                <p className="text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 1 && (
          <div className="flex flex-col gap-6">
            {qualifications.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="shrink-0 w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  {item.year}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{item.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{item.org}</p>
                </div>
                <div className="shrink-0 text-xs uppercase tracking-widest text-gray-400 bg-gray-50 rounded-full px-4 py-2">
                  {item.hours}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
