TEYVAT CHRONICLES — INSTALLATION OVHCLOUD
=========================================

CONTENU
- index.php                 Page principale du site
- assets/css/style.css      Design responsive
- assets/js/app.js          Recherche, filtres, menu mobile, newsletter
- api/characters.php        API PHP qui lit les personnages en MySQL (secours)
- api/catalog.php           Catalogue des personnages jouables + cache 12 h
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
- Le catalogue principal charge les personnages jouables depuis l'API publique genshin.jmp.blue.
  Les illustrations de carte et splash art sont chargées depuis cette même source.
  Le cache serveur dure 12 heures. La base MySQL reste utilisée comme secours.
- La recherche et les filtres doivent fonctionner.
- Le formulaire newsletter doit enregistrer les e-mails dans
  newsletter_subscribers.
Si la base n'est pas encore configurée, la page affiche un aperçu local
de démonstration et l'inscription newsletter indique que la base manque.

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
- La page utilise api/catalog.php, un proxy PHP avec cache de 12 heures.
- Source des données et images : https://genshin.jmp.blue/
- Projet API communautaire : https://github.com/genshindev/api
- Les images ne sont pas copiées dans ce dépôt : elles sont servies par la source.
  Une connexion Internet et l'accès sortant HTTPS depuis l'hébergement sont requis.
- Si la source distante est indisponible, le site tente le catalogue MySQL local,
  puis affiche un petit jeu de données de démonstration.
- La source est non officielle et peut modifier son format ou devenir indisponible.
- Les illustrations et marques Genshin Impact restent la propriété de HoYoverse
  et de leurs ayants droit. Le site est un projet de fans non officiel.
