
CREATE TABLE t_p97248965_project_zenith_launc.profile (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL
);

INSERT INTO t_p97248965_project_zenith_launc.profile (key, value) VALUES
  ('name', 'Олзоева Елена Борисовна'),
  ('title', 'Воспитатель | Педагог дошкольного образования'),
  ('bio', 'Воспитатель, исследователь и немного волшебник — каждый день превращаю обычные занятия в увлекательные творческие приключения. Мой девиз: «Играем — познаём, творим — растём, чувствуем красоту — развиваемся!»'),
  ('motto', 'Играем — познаём, творим — растём, чувствуем красоту — развиваемся!'),
  ('experience', '5'),
  ('about_text', 'Почему волшебник? Потому что каждый день я превращаю обычные занятия в увлекательные художественные приключения, а вопросы «почему?» и «как?» — в маленькие творческие открытия.'),
  ('about_text2', 'Для меня воспитатель — это не профессия, а состояние души: уметь видеть мир глазами ребёнка, удивляться вместе с ним, поддерживать в любой ситуации и верить в его безграничные возможности.'),
  ('about_text3', 'Каждый день я открываю для себя что‑то новое — через глаза моих воспитанников. Их искренность, любопытство и непосредственность заряжают меня энергией и вдохновляют на творчество.'),
  ('photo', 'https://cdn.poehali.dev/projects/1da36ac5-d950-44d7-a995-81a6bc4f6234/bucket/e59df744-f8a9-4d05-87fc-f56111b7498b.jpg'),
  ('telegram', 'https://t.me/'),
  ('vk', 'https://vk.com/'),
  ('instagram', 'https://instagram.com/');

CREATE TABLE t_p97248965_project_zenith_launc.portfolio_profile (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO t_p97248965_project_zenith_launc.portfolio_profile (label, value, sort_order) VALUES
  ('ФИО', 'Олзоева Елена Борисовна', 1),
  ('Должность', 'Воспитатель', 2),
  ('Место работы', 'Указать учреждение', 3),
  ('Образование', 'Указать образование', 4),
  ('Специальность по диплому', 'Указать специальность', 5),
  ('Стаж педагогической работы', '5 лет', 6),
  ('Квалификационная категория', 'Указать категорию', 7),
  ('Дата последней аттестации', 'Указать дату', 8);

CREATE TABLE t_p97248965_project_zenith_launc.qualifications (
  id SERIAL PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  org TEXT NOT NULL,
  hours TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO t_p97248965_project_zenith_launc.qualifications (year, title, org, hours, sort_order) VALUES
  ('2024', 'Название курса или программы', 'Название организации', '72 часа', 1),
  ('2023', 'Название курса или программы', 'Название организации', '36 часов', 2),
  ('2022', 'Название курса или программы', 'Название организации', '108 часов', 3);

CREATE TABLE t_p97248965_project_zenith_launc.achievements (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('my', 'kids')),
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  level TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

INSERT INTO t_p97248965_project_zenith_launc.achievements (type, year, title, description, level, sort_order) VALUES
  ('my', '2024', 'Название достижения или награды', 'Описание достижения, конкурса или мероприятия', 'Муниципальный', 1),
  ('my', '2023', 'Название достижения или награды', 'Описание достижения, конкурса или мероприятия', 'Региональный', 2),
  ('kids', '2024', 'Название конкурса или мероприятия', 'Результат воспитанников, место или призы', 'Муниципальный', 1),
  ('kids', '2023', 'Название конкурса или мероприятия', 'Результат воспитанников, место или призы', 'Региональный', 2);

CREATE TABLE t_p97248965_project_zenith_launc.methods_files (
  id SERIAL PRIMARY KEY,
  tab TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p97248965_project_zenith_launc.gallery (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p97248965_project_zenith_launc.admin_session (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
