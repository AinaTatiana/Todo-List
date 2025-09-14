
        // === VARIABLES ET RÉFÉRENCES ===
        let listeTaches = []; // Tableau contenant toutes les tâches
        let filtreActuel = 'toutes'; // Filtre actuellement sélectionné
        let prochainId = 1; // ID pour les nouvelles tâches

        // Références vers les éléments HTML
        const elements = {
            champSaisie: document.getElementById('nouvelle-tache'),
            boutonAjouter: document.getElementById('bouton-ajouter'),
            listeTaches: document.getElementById('liste-taches'),
            messageVide: document.getElementById('message-vide'),
            compteurRestantes: document.getElementById('taches-restantes'),
            compteurs: {
                toutes: document.getElementById('compteur-toutes'),
                actives: document.getElementById('compteur-actives'),
                terminees: document.getElementById('compteur-terminees')
            },
            boutonsTout: document.getElementById('bouton-tout-supprimer'),
            boutonsTerminees: document.getElementById('bouton-supprimer-terminees')
        };

        // === FONCTIONS UTILITAIRES ===
        
        /**
         * Crée une nouvelle tâche avec un ID unique
         */
        function creerNouvelleTache(texte) {
            return {
                id: prochainId++,
                texte: texte.trim(),
                terminee: false,
                dateCreation: new Date()
            };
        }

        /**
         * Met à jour tous les compteurs dans l'interface
         */
        function mettreAJourCompteurs() {
            const tachesActives = listeTaches.filter(tache => !tache.terminee);
            const tachesTerminees = listeTaches.filter(tache => tache.terminee);

            elements.compteurRestantes.textContent = tachesActives.length;
            elements.compteurs.toutes.textContent = listeTaches.length;
            elements.compteurs.actives.textContent = tachesActives.length;
            elements.compteurs.terminees.textContent = tachesTerminees.length;
        }

        /**
         * Crée l'élément HTML pour une tâche
         */
        function creerElementTache(tache) {
            const elementTache = document.createElement('li');
            elementTache.className = `tache ${tache.terminee ? 'terminee' : ''}`;
            elementTache.dataset.id = tache.id;

            elementTache.innerHTML = `
                <div class="contenu-tache">
                    <label class="conteneur-checkbox">
                        <input type="checkbox" ${tache.terminee ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="texte-tache">${tache.texte}</span>
                    <button class="bouton-supprimer" title="Supprimer cette tâche">
                        <span>×</span>
                    </button>
                </div>
            `;

            // Gestion du changement d'état (terminé/actif)
            const checkbox = elementTache.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => basculerEtatTache(tache.id));

            // Gestion de la suppression
            const boutonSupprimer = elementTache.querySelector('.bouton-supprimer');
            boutonSupprimer.addEventListener('click', () => supprimerTache(tache.id));

            return elementTache;
        }

        /**
         * Affiche les tâches selon le filtre sélectionné
         */
        function afficherTaches() {
            let tachesAffichees = listeTaches;

            // Appliquer le filtre
            switch (filtreActuel) {
                case 'actives':
                    tachesAffichees = listeTaches.filter(tache => !tache.terminee);
                    break;
                case 'terminees':
                    tachesAffichees = listeTaches.filter(tache => tache.terminee);
                    break;
            }

            // Vider la liste actuelle
            elements.listeTaches.innerHTML = '';

            // Afficher le message si aucune tâche
            if (tachesAffichees.length === 0) {
                elements.messageVide.style.display = 'flex';
                elements.listeTaches.style.display = 'none';
            } else {
                elements.messageVide.style.display = 'none';
                elements.listeTaches.style.display = 'block';

                // Ajouter chaque tâche à la liste
                tachesAffichees.forEach(tache => {
                    const elementTache = creerElementTache(tache);
                    elements.listeTaches.appendChild(elementTache);
                });
            }

            mettreAJourCompteurs();
        }

        // === ACTIONS SUR LES TÂCHES ===

        /**
         * Ajoute une nouvelle tâche à la liste
         */
        function ajouterTache() {
            const texte = elements.champSaisie.value.trim();
            
            if (texte === '') {
                elements.champSaisie.focus();
                return;
            }

            const nouvelleTache = creerNouvelleTache(texte);
            listeTaches.push(nouvelleTache);
            
            elements.champSaisie.value = '';
            afficherTaches();

            // Animation subtile du bouton
            elements.boutonAjouter.style.transform = 'scale(0.95)';
            setTimeout(() => {
                elements.boutonAjouter.style.transform = 'scale(1)';
            }, 150);
        }

        /**
         * Change l'état d'une tâche (terminé/actif)
         */
        function basculerEtatTache(idTache) {
            const tache = listeTaches.find(t => t.id === idTache);
            if (tache) {
                tache.terminee = !tache.terminee;
                afficherTaches();
            }
        }

        /**
         * Supprime une tâche spécifique
         */
        function supprimerTache(idTache) {
            listeTaches = listeTaches.filter(tache => tache.id !== idTache);
            afficherTaches();
        }

        /**
         * Supprime toutes les tâches
         */
        function supprimerToutesLesTaches() {
            if (listeTaches.length === 0) return;
            
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer toutes les tâches ?');
            if (confirmation) {
                listeTaches = [];
                afficherTaches();
            }
        }

        /**
         * Supprime uniquement les tâches terminées
         */
        function supprimerTachesTerminees() {
            const tachesTerminees = listeTaches.filter(tache => tache.terminee);
            if (tachesTerminees.length === 0) return;

            const confirmation = confirm(`Supprimer ${tachesTerminees.length} tâche(s) terminée(s) ?`);
            if (confirmation) {
                listeTaches = listeTaches.filter(tache => !tache.terminee);
                afficherTaches();
            }
        }

        // === GESTION DES FILTRES ===

        /**
         * Change le filtre actuel et met à jour l'affichage
         */
        function changerFiltre(nouveauFiltre) {
            filtreActuel = nouveauFiltre;
            
            // Mettre à jour les styles des boutons
            document.querySelectorAll('.bouton-filtre').forEach(bouton => {
                bouton.classList.remove('actif');
            });
            
            document.querySelector(`[data-filtre="${nouveauFiltre}"]`).classList.add('actif');
            
            afficherTaches();
        }

        // === INITIALISATION ET ÉVÉNEMENTS ===

        /**
         * Initialise l'application au chargement de la page
         */
        function initialiser() {
            // Événements pour ajouter des tâches
            elements.boutonAjouter.addEventListener('click', ajouterTache);
            
            elements.champSaisie.addEventListener('keypress', (evenement) => {
                if (evenement.key === 'Enter') {
                    ajouterTache();
                }
            });

            // Événements pour les filtres
            document.querySelectorAll('.bouton-filtre').forEach(bouton => {
                bouton.addEventListener('click', () => {
                    changerFiltre(bouton.dataset.filtre);
                });
            });

            // Événements pour les actions globales
            elements.boutonsTout.addEventListener('click', supprimerToutesLesTaches);
            elements.boutonsTerminees.addEventListener('click', supprimerTachesTerminees);

            // Affichage initial
            afficherTaches();
            elements.champSaisie.focus();
        }

        // Lancer l'application quand la page est chargée
        document.addEventListener('DOMContentLoaded', initialiser);
