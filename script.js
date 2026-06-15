document.addEventListener('DOMContentLoaded', () => {
    const consoleElement = document.getElementById('console');
    const commandInput = document.getElementById('command-input'); // On utilise l'ID pour une référence unique

    let currentColor = '#bb44ff'; // Couleur par défaut
    let currentTreeElement = null; // Référence à l'élément du sapin
    let exist_tree = false;
    let ballCounter = 0; // Compteur de boules pour l'animation
    let animIntervalId = null;
    let exist_cat = false;
    let catFrame = 0;
    let catAnimIntervalId = null;
    let currentCatElement = null;
    // Liste des commandes pour l'autocomplétion
const commandesDisponibles = [
    'aide', 
    'sapin', 
    'couleur', 
    'effacer', 
    'animer', 
    'stop_anim', 
    'eteindre'
];

    document.documentElement.style.setProperty('--current-color', currentColor);

    // --- Fonctions d'Affichage ---

    // Fonction pour ajouter une ligne à la console
    function addLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `console-line ${className}`.trim();
        line.style.color = currentColor; // Appliquer la couleur actuelle à toutes les lignes d'historique
        line.textContent = text;
        
        // Ajouter la ligne juste avant l'élément d'entrée (le conteneur 'input-line')
        const inputLine = document.getElementById('input-line');
        consoleElement.insertBefore(line, inputLine); 
        
        consoleElement.scrollTop = consoleElement.scrollHeight;
    }

    function showCat(){
    if (exist_cat) {
        // Prevent duplicate cats
        addLine("A cat is already lounging here!", 'error');
        return;
    }

    const chat = `
 /\\_/\\
( o.o)
 > ^ <
    `.trim();

        // --- CREATION ---
        const catElement = document.createElement('pre');
        catElement.className = 'cat-art';
        catElement.style.color = currentColor;
        catElement.textContent = chat;
    
        // --- INSERTION ---
        const inputLine = document.getElementById('input-line');
        consoleElement.insertBefore(catElement, inputLine);
        consoleElement.scrollTop = consoleElement.scrollHeight;

        // --- STATE MANAGEMENT  ---
        currentCatElement = catElement;
        exist_cat = true;
    }

function anim_cat() {
    if (!currentCatElement) return;

    let currentASCII = currentCatElement.textContent;
    let newASCII;
    
    // Les deux états du chat
    const yeuxOuverts = '( o.o)';
    const yeuxFermes = '( -.-)'; // Assurez-vous d'avoir le même nombre d'espaces !

    if (catFrame === 0) {
        // État 0 -> État 1 (Fermer les yeux)
        // newASCII = currentASCII.replace(yeuxOuverts, yeuxFermes);
        
        // CORRECTION ROBUSTE : Utiliser l'index
        let chars = currentASCII.split('');
        
        // Ces index sont basés sur la structure finale du chat simple.
        // Vous devrez peut-être ajuster légèrement ces numéros (exemple: 15 et 19)
        const indexOeilGauche = currentASCII.indexOf('o'); 
        const indexOeilDroit = currentASCII.lastIndexOf('o'); 

        if (indexOeilGauche !== -1 && indexOeilDroit !== -1) {
             chars[indexOeilGauche] = '-';
             chars[indexOeilDroit] = '-';
             newASCII = chars.join('');
             catFrame = 1; // Passe à l'état "yeux fermés"
             currentCatElement.textContent = newASCII;
        }

    } else {
        // État 1 -> État 0 (Rouvrir les yeux)
        // On remplace les yeux fermés par les yeux ouverts dans le DOM
        newASCII = currentASCII.replace('( -.-)', yeuxOuverts);
        
        // Mettre à jour si le remplacement a eu lieu (méthode de secours)
        if (newASCII !== currentASCII) {
            currentCatElement.textContent = newASCII;
            catFrame = 0; // Passe à l'état "yeux ouverts"
        } else {
            // Si le remplacement n'a pas marché, forçons l'ouverture
            currentCatElement.textContent = currentASCII.replace(/-/g, 'o');
            catFrame = 0;
        }
    }
}
    
// Assurez-vous que ces variables sont bien déclarées au début de votre script (hors de cette fonction) :
// let exist_tree = false;
// let currentTreeElement = null;
// let ballCounter = 0; // IMPORTANT: Réinitialisé dans clearConsole()
// const consoleElement = document.getElementById('console');

function showTree() {
    if (!exist_tree) {
        // Constantes
        const h_def = 10; // Hauteur du sapin (10 lignes)
        const prob_ball = 50; // Probabilité d'avoir une étoile (40) vs une boule (60)
        const decalage = 8; // Décalage pour centrer l'ensemble du sapin
        let sapin = "";

        // Réinitialisation du compteur avant la création du sapin
        ballCounter = 0;

        // Construction du sapin (couronne)
        for (let i = 1; i <= h_def; i++) {
            let nbr_chars = (i * 2) - 1;
            let ligne = "";
            
            for (let j = 0; j < nbr_chars; j++) {
                // Ajout des boules aléatoires avec des <span> pour l'animation
                if (Math.random() * 100 > prob_ball) {
                    ballCounter++;
                    ligne += `<span class="balln${ballCounter}">o</span>`; // Boule clignotante
                } else {
                    ligne += "*"; // Étoile
                }
            }
            
            // Ajout des espaces pour centrer la ligne et appliquer le décalage global
            const nbr_espaces = Math.max(0, (h_def - i) - decalage);
            const espaces = " ".repeat(nbr_espaces);
            sapin += espaces + ligne + "\n";
        }

        // Ajout du tronc
        const tronc = "|";
        const base = "_".repeat(3); 
        
        // Calcul des espaces pour centrer le tronc (h_def - 2) - decalage
        const nbr_espaces_tronc = Math.max(0, (h_def - 2) - decalage);
        const espaces_tronc = " ".repeat(nbr_espaces_tronc); 
        
        const pied = espaces_tronc + tronc + base + tronc + "\n";
        
        // Ajoutez le tronc deux fois pour une meilleure hauteur
        sapin += pied;
        sapin += pied; 

        // Création de l'élément pour afficher le sapin
        const treeElement = document.createElement('pre');
        treeElement.className = 'sapin';
        treeElement.style.color = currentColor;
        treeElement.innerHTML = sapin;

        // Stocker l'élément créé pour la manipulation de couleur
        currentTreeElement = treeElement;

        // Ajout du sapin à la console
        const inputLine = document.getElementById('input-line');
        consoleElement.insertBefore(treeElement, inputLine);
        
        consoleElement.scrollTop = consoleElement.scrollHeight;
        exist_tree = true;
    }
}

function sapin_anim() {
    const max_balls = ballCounter; 

    for(let i = 1 ; i <= max_balls ; i++) {
        // Génération de couleur RGB aléatoire
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        
        // Construction de la chaîne de couleur
        const rgbColor = `rgb(${r}, ${g}, ${b})`;
        
        // Application du style directement sur l'élément via l'attribut 'style'
        // L'ajout de !important garantit que le CSS ne bloquera pas le changement
        $(".balln" + i).attr("style", `color: ${rgbColor} !important;`);
    }
}

    // Fonction pour afficher l'aide
    function showHelp() {
        const helpText = `
Commandes disponibles :
- aide : Affiche cette aide
- sapin : Affiche un sapin de Noël
- couleur [couleur] : Change la couleur globale (rouge, vert, bleu, jaune, rose, cyan, violet)
- effacer : Efface la console
- animer : Lance l'animation des boules
- stop_anim : Fige l'animation (garde les couleurs actuelles)
- eteindre : Arrête l'animation et remet les boules à la couleur du sapin
`;
        addLine(helpText, 'help');
    }

    function clearConsole() {
        // Sélectionnez tous les enfants de la console SAUF le conteneur de l'input
        const linesToRemove = Array.from(consoleElement.children).filter(child => child.id !== 'input-line');
        linesToRemove.forEach(line => line.remove());
        currentTreeElement = null;
        exist_tree = false;
        exist_cat = false;
    }

    // --- Gestion de la Commande ---
    
    // Fonction pour gérer la soumission des commandes
    function handleCommand() {
        const command = commandInput.value.trim();
        const lowerCommand = command.toLowerCase();
        const args = lowerCommand.split(' ');
        const cmd = args[0];
        
        if (command === '') {
            // Afficher une simple ligne vide dans l'historique
            addLine('>', 'command');
            commandInput.value = '';
            return;
        }

        if (cmd === 'sapin' && exist_tree) {
        // On n'ajoute rien à l'historique et on sort de la fonction
        commandInput.value = '';
        commandInput.focus(); 
        return; 
    }

        // 1. Déplacer la commande tapée dans l'historique (l'ancien input)
        addLine(`> ${command}`, 'command');

        // 2. Traiter la commande
        switch(cmd) {
            case 'sapin':
                showTree();
                break;
                
            case 'couleur':
                const colorName = args[1];
                const colors = {
                    'rouge': '#ff4444',
                    'vert': '#44ff44',
                    'bleu': '#4444ff',
                    'jaune': '#ffff44',
                    'rose': '#ff44ff',
                    'cyan': '#44ffff',
                    'violet': '#bb44ff'
                };
                
                if (colorName && colors[colorName]) {
                    currentColor = colors[colorName];
                    
                    // ----------------------------------------------------
                    // 1. Mise à jour de la variable CSS GLOBALE pour:
                    //    - Bordure de la console (box-shadow)
                    //    - Curseur (caret-color)
                    //    - Barre de défilement
                    document.documentElement.style.setProperty('--current-color', currentColor);

                    // 2. Mise à jour de la couleur de TOUS les anciens textes
                    //    (L'élément 'console' définit la couleur par défaut de l'historique)
                    document.getElementById('console').style.color = currentColor;

                    // 3. Mise à jour des éléments spécifiques
                    document.querySelector('.prompt').style.color = currentColor; 
                    commandInput.style.color = currentColor; 
                    
                    const historiqueLines = consoleElement.querySelectorAll('.console-line, pre.sapin');
                    
                    historiqueLines.forEach(line => {
                        // On ignore la ligne d'input et les messages d'erreur/aide
                        if (line.id !== 'input-line' && 
                            !line.classList.contains('error') &&
                            !line.classList.contains('help')) {
                                
                            line.style.color = currentColor;
                        }
                    });

                    if (currentCatElement) {
                        currentCatElement.style.color = currentColor;
                    }

                    // 4. Mise à jour de la couleur du sapin s'il existe
                    if (currentTreeElement) {
                        currentTreeElement.style.color = currentColor;
                    }
                    
                    addLine(`Couleur changée en ${colorName}`, 'help');
                } else {
                    addLine('Couleur non reconnue. Utilisez : rouge, vert, bleu, jaune, rose ou cyan', 'error');
                }
                break;
                
            case 'aide':
                showHelp();
                break;
                
            case 'effacer':
                clearConsole();
                break;

            case 'animer':
                if (animIntervalId !== null) {
                    addLine("L'animation est déjà en cours. Tapez 'stop_anim' pour l'arrêter.", 'help');
                } else {
                    // Démarrage de l'animation (toutes les 500ms)
                    animIntervalId = setInterval(sapin_anim, 500); 
                    addLine("Animation démarrée ! Les boules clignotent joyeusement.", 'help');
                }
                break;

            case 'stop_anim':
                if (animIntervalId !== null) {
                    clearInterval(animIntervalId);
                    animIntervalId = null;
                    addLine("Animation arrêtée.", 'help');
                } else {
                    addLine("L'animation n'était pas en cours.", 'error');
                }
                break;
            case 'eteindre':
                if (!exist_tree) {
                    addLine("Il n'y a pas de sapin à éteindre.", 'error');
                } else {
                    // 1. Arrêter l'animation si elle court
                    if (animIntervalId !== null) {
                        clearInterval(animIntervalId);
                        animIntervalId = null;
                    }
    
                    // 2. Réinitialiser les boules
                    // On utilise une boucle pour nettoyer chaque boule
                    for(let i = 1; i <= ballCounter; i++) {
                        // .removeAttr('style') efface la couleur RGB forcée par l'animation
                        // Les boules reprendront alors la couleur 'currentColor' du parent
                        $(".balln" + i).removeAttr('style');
                    }
    
                    addLine("Le sapin est éteint. Les boules sont remises à la couleur normale.", 'help');
                }
                break;      
            case 'alice':
                addLine("Hello ! Joyeux Noël ! 🎄", 'help');
                addLine("Voici un petit cadeau pour toi : 🎁", 'help');
                addLine("CHAT", 'help');
                showCat();
                catAnimIntervalId = setInterval(anim_cat, 800);
                break;   
            case'chat':
                showCat();
                break;   
            case 'cat':
                // Vérifie si l'animation est déjà lancée
                if (catAnimIntervalId) {
                    addLine("Le chat cligne déjà des yeux !", 'error');
                    return;
                }
                // Vérifie si le chat existe
                if (!exist_cat) {
                    addLine("Affichez d'abord le chat avec 'chat'.", 'error');
                    return;
                }

                addLine("Le chat commence à cligner des yeux...", 'success');
                // LANCE LA BOUCLE : appelle anim_cat toutes les 800 millisecondes (0.8 seconde)
                catAnimIntervalId = setInterval(anim_cat, 800); 
                break;
            case 'stop_cat':
                if (!catAnimIntervalId) {
                    addLine("L'animation du chat n'est pas en cours.", 'error');
                    return;
                }
                // ARRÊTE LA BOUCLE
                clearInterval(catAnimIntervalId);
                catAnimIntervalId = null; // Réinitialise l'ID
                addLine("Animation du chat arrêtée.", 'success');
                break;
            default:
                addLine(`Commande inconnue : ${cmd}. Tapez 'aide' pour voir les commandes disponibles.`, 'error');
        }
        
        // 3. Réinitialiser le champ de saisie et lui redonner le focus
        commandInput.value = '';
        commandInput.focus(); 
    }


    // --- Événements ---
    
    // Écouter la touche Entrée sur le champ de saisie
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Empêche le comportement par défaut (ex: soumission de formulaire)
            handleCommand();
        }
    });

    // Afficher le message d'accueil au chargement
    addLine("Bienvenue sur la console de Noël ! Tapez 'aide' pour voir les commandes.", 'help');
    
    // Mettre le focus au démarrage
    commandInput.focus();

    commandInput.addEventListener('keydown', (e) => {
    if(e.key === 'Tab') {
        e.preventDefault();
        const input = commandInput.value.trim();
        const matchingCommands = commandesDisponibles.filter(cmd => cmd.startsWith(input));

        if(matchingCommands.length === 1) {
            commandInput.value = matchingCommands[0];
        } else if (matchingCommands.length > 1) {
            const optionsString = matchingCommands.join(', ');
            addLine(optionsString, 'help');
        }
    }
})
});

