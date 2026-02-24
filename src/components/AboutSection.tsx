export default function AboutSection() {
  return (
    <section className="bg-white py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl shadow-xl">
              <img
                src="https://cdn.poehali.dev/projects/1da36ac5-d950-44d7-a995-81a6bc4f6234/bucket/e59df744-f8a9-4d05-87fc-f56111b7498b.jpg"
                alt="Олзоева Елена Борисовна"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-black text-white rounded-2xl px-6 py-5 shadow-xl">
              <p className="text-3xl font-semibold">5</p>
              <p className="text-xs text-white/60 uppercase tracking-widest mt-1">лет опыта</p>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">О себе</p>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 leading-snug">
                Воспитатель, исследователь и немного волшебник
              </h2>
            </div>

            <div className="flex flex-col gap-5 text-gray-600 text-base leading-relaxed">
              <p>
                Почему волшебник? Потому что каждый день я превращаю обычные занятия в увлекательные художественные приключения, а вопросы «почему?» и «как?» — в маленькие творческие открытия.
              </p>
              <p>
                Для меня воспитатель — это не профессия, а состояние души: уметь видеть мир глазами ребёнка, удивляться вместе с ним, поддерживать в любой ситуации и верить в его безграничные возможности.
              </p>
              <p>
                Каждый день я открываю для себя что‑то новое — через глаза моих воспитанников. Их искренность, любопытство и непосредственность заряжают меня энергией и вдохновляют на творчество.
              </p>
            </div>

            <div className="border-l-2 border-black pl-6">
              <p className="text-lg font-light text-gray-800 italic">
                «Играем — познаём, творим — растём, чувствуем красоту — развиваемся!»
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
