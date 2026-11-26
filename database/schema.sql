CREATE TABLE IF NOT EXISTS characters (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL DEFAULT '',
  name VARCHAR(80) NOT NULL,
  title VARCHAR(140) NOT NULL DEFAULT '',
  element VARCHAR(30) NOT NULL,
  weapon VARCHAR(40) NOT NULL DEFAULT '',
  rarity TINYINT UNSIGNED NOT NULL DEFAULT 4,
  region VARCHAR(60) NOT NULL DEFAULT '',
  description VARCHAR(500) NOT NULL DEFAULT '',
  image_url VARCHAR(500) NOT NULL DEFAULT '',
  card_url VARCHAR(700) NOT NULL DEFAULT '',
  splash_url VARCHAR(700) NOT NULL DEFAULT '',
  is_published TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_character_name (name),
  INDEX idx_characters_slug (slug),
  INDEX idx_character_element (element)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(190) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO characters (name, title, element, weapon, rarity, region, description, image_url) VALUES
('Aether', 'Le voyageur', 'Géo', 'Épée', 5, 'Inconnu', 'Un voyageur venu d’un autre monde, à la recherche de son jumeau disparu.', ''),
('Lumine', 'Le voyageur', 'Anémo', 'Épée', 5, 'Inconnu', 'Une voyageuse venue d’un autre monde, liée au destin de Teyvat.', ''),
('Amber', 'Championne de reconnaissance', 'Pyro', 'Arc', 4, 'Mondstadt', 'La dernière éclaireuse des Chevaliers de Favonius, toujours prête à aider.', ''),
('Jean', 'Chevalier de pissenlit', 'Anémo', 'Épée', 5, 'Mondstadt', 'Grande Maîtresse par intérim, elle veille sans relâche sur Mondstadt.', ''),
('Kaeya', 'Cavalier de la brise', 'Cryo', 'Épée', 4, 'Mondstadt', 'Un capitaine énigmatique au sourire aussi charmant que ses intentions sont secrètes.', ''),
('Lisa', 'Rose des péchés', 'Électro', 'Catalyseur', 4, 'Mondstadt', 'Une bibliothécaire brillante qui préfère les journées tranquilles.', ''),
('Xiangling', 'Cheffe cuisinière', 'Pyro', 'Lance', 4, 'Liyue', 'Une cheffe passionnée qui n’a peur d’aucune expérience culinaire.', ''),
('Ningguang', 'Étoile en éclipse', 'Géo', 'Catalyseur', 4, 'Liyue', 'La Tianquan du Qixing, dont la fortune et l’influence sont légendaires.', ''),
('Keqing', 'Éclair de la nuit', 'Électro', 'Épée', 5, 'Liyue', 'Une dirigeante déterminée qui croit au pouvoir de l’action humaine.', ''),
('Ayaka', 'Héron givré', 'Cryo', 'Épée', 5, 'Inazuma', 'La fille du clan Kamisato, reconnue pour sa grâce et son sens du devoir.', ''),
('Collei', 'Jeune pousse', 'Dendro', 'Arc', 4, 'Sumeru', 'Une apprentie garde forestière qui avance avec courage.', ''),
('Neuvillette', 'Ordonnateur suprême', 'Hydro', 'Catalyseur', 5, 'Fontaine', 'Le juge en chef de Fontaine, gardien d’une justice rigoureuse.', '')
ON DUPLICATE KEY UPDATE title = VALUES(title);
