TEYVAT CHRONICLES — INSTALLATION OVHCLOUD
=========================================

CONTENU
- index.php                 Page principale du site
- assets/css/style.css      Design responsive
- assets/js/app.js          Recherche, filtres, menu mobile, newsletter
- api/characters.php        API PHP qui lit les personnages en MySQL (secours)
- api/catalog.php           Catalogue local lu depuis MySQL
- api/subscribe.php         Enregistrement des inscriptions newsletter
- database/schema.sql       Tables + personnages de démonstration
- config.example.php        Exemple de configuration MySQL
- tools/validate_data.py    Petit outil facultatif de validation JSON

1) CRÉER LA BASE DE DONNÉES
Dans l'espace client OVHcloud :
Web Cloud > Hébergements > votre hébergement > Bases de données.
Créez une base MySQL et notez :
- serveur / adresse de la base (ex. xxx.mysql.db)
- nom de la base
- utilisateur
- mot de passe

2) IMPORTER LES TABLES
Ouvrez phpMyAdmin depuis l'espace client OVH.
Sélectionnez la base créée, onglet Importer, puis choisissez :
database/schema.sql
L'import crée les tables characters et newsletter_subscribers et insère
12 personnages de démonstration.

3) CONFIGURER LE SITE
Sur votre ordinateur, copiez config.example.php en config.php.
Remplacez les 4 valeurs de connexion par celles données par OVH.
Ne transmettez jamais ce fichier à quelqu'un et ne publiez pas ses secrets.

4) ENVOYER LES FICHIERS
Décompressez le ZIP sur votre ordinateur.
Envoyez le CONTENU du dossier teyvat-chronicles dans le dossier racine
du site OVH (généralement www/ ou le dossier associé à votre multisite).
Envoyez aussi config.php à la racine du site.
Le fichier index.php doit se trouver directement dans le dossier web :
www/index.php (ou le dossier racine correspondant).

5) PHP ET HTTPS
Dans l'espace client OVH, réglez l'environnement d'exécution sur Stable64
et choisissez une version PHP 8.x proposée par OVH. Activez le SSL/HTTPS
pour votre domaine.

6) TESTER
Ouvrez votre domaine.
- Le catalogue principal lit maintenant les personnages depuis MySQL.
- La recherche et les filtres utilisent les données locales.
- Le formulaire newsletter enregistre les e-mails dans newsletter_subscribers.
Pour remplir le catalogue, suivez database/IMPORT-CHARACTERS.txt.

IMPORT DU CATALOGUE
Le script tools/build_character_import.py se lance sur votre PC Windows.
Il génère database/characters_import.sql et database/characters_images.csv.
Importez le fichier SQL dans phpMyAdmin sur la base OVH. Pour télécharger aussi
les images sur votre PC, lancez le script avec --download-images, puis transférez
le dossier uploads/characters/ sur OVH avant de réimporter le SQL.
L'hébergement OVH ne contacte donc plus l'API pour afficher les personnages.

PYTHON
Le site n'a pas besoin d'un processus Python qui tourne en permanence.
L'hébergement web mutualisé OVH peut proposer Python via son environnement,
mais les versions disponibles et les possibilités d'exécution dépendent
de la configuration. Le script tools/validate_data.py est un outil
facultatif à lancer depuis un terminal Python 3.7+ sur votre PC ou SSH.

SÉCURITÉ / PROCHAINES ÉTAPES
- N'ajoutez pas config.php à un dépôt Git.
- Gardez PHP et les dépendances à jour.
- La newsletter stocke les adresses e-mail : ajoutez une politique de
  confidentialité et une procédure de désinscription avant une utilisation
  publique réelle. Le double opt-in n'est pas encore implémenté.
- Le site est une base MVP fan-made : il n'est ni affilié à HoYoverse,
  ni un site officiel. Genshin Impact, ses personnages et marques appartiennent
  à leurs ayants droit.
- Les images ne sont pas stockées dans le dépôt : le catalogue les charge
  depuis la source communautaire documentée ci-dessous. Si cette source est
  indisponible, le catalogue local peut afficher des visuels de remplacement.


CATALOGUE DES PERSONNAGES
- api/catalog.php lit exclusivement la table MySQL characters.
- Les champs card_url et splash_url contiennent les URL ou chemins locaux des images.
- La génération de l'import est réalisée depuis le PC, jamais depuis OVH.
- Source communautaire de données : https://github.com/theBowja/genshin-db
- API utilisée par l'outil local de génération : https://genshin.jmp.blue/
- Les images et la marque Genshin Impact restent la propriété de HoYoverse
  et de leurs ayants droit. Le site est un projet de fans non officiel.
