-- Teyvat Chronicles - migration du catalogue local
-- À exécuter UNE SEULE FOIS dans phpMyAdmin, sur la base utilisée par le site.
-- Les URL d'images sont enregistrées en base ; elles sont chargées par le navigateur.

ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS slug VARCHAR(100) NOT NULL DEFAULT '' AFTER id,
  ADD COLUMN IF NOT EXISTS card_url VARCHAR(700) NOT NULL DEFAULT '' AFTER image_url,
  ADD COLUMN IF NOT EXISTS splash_url VARCHAR(700) NOT NULL DEFAULT '' AFTER card_url;

UPDATE characters
SET slug = CASE
  WHEN name = 'Aether' THEN 'aether'
  WHEN name = 'Lumine' THEN 'lumine'
  WHEN name = 'Amber' THEN 'amber'
  WHEN name = 'Jean' THEN 'jean'
  WHEN name = 'Kaeya' THEN 'kaeya'
  WHEN name = 'Lisa' THEN 'lisa'
  WHEN name = 'Xiangling' THEN 'xiangling'
  WHEN name = 'Ningguang' THEN 'ningguang'
  WHEN name = 'Keqing' THEN 'keqing'
  WHEN name = 'Ayaka' THEN 'kamisato-ayaka'
  WHEN name = 'Collei' THEN 'collei'
  WHEN name = 'Neuvillette' THEN 'neuvillette'
  ELSE LOWER(REPLACE(name, ' ', '-'))
END
WHERE slug = '';

UPDATE characters
SET
  card_url = CONCAT('https://genshin.jmp.blue/characters/', slug, '/card'),
  splash_url = CONCAT('https://genshin.jmp.blue/characters/', slug, '/gacha-splash')
WHERE card_url = '' OR splash_url = '';

CREATE INDEX IF NOT EXISTS idx_characters_slug ON characters (slug);
