const listWords = document.getElementById("list-mots");
const containerWords = document.getElementById("mots-selected");
const penduImage = document.getElementById("penduImage");
const display_attemps = document.getElementById("display_attemps");

const closeModalBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');

// Capture le niveau de difficulté sélectionné sur le bouton 
// Captura o nivel de dificuldade que foi selecionado no button 
let url_string = window.location.href;
let url = new URL(url_string);
let data = url.searchParams.get("niveau");
let wordsSecrets = [];
let wordSelect = '';    

// Détecte la chaîne de requête et sélectionne le tableau de mots
// Detecta a query string e seleciona o array de palavras
switch (data) {
    case "easy":
        // console.log("This is easy");
        wordsSecrets = ["JAVA", "JAVASCRIPT", "PHP", "PYTHON"];
        break;
    case "medium":
        // console.log("This is medium");
        wordsSecrets = ["PROGRAMMATION", "JAVASCRIPT", "CSS", "HTML", "PHP", "BASH", "TYPESCRIPT", "PYTHON"];
        break;
    case "hard":
        // console.log("This is hard");
        wordsSecrets = ["PROGRAMMATION", "JAVASCRIPT", "CSS", "HTML", "PHP", "ELIXIR", "PASCAL", "LUA", "DART", "RUBY", "RUST", "COBOL", "TYPESCRIPT"];
        break;
    default:
        wordsSecrets = ["JAVA", "JAVASCRIPT", "PHP", "PYTHON"];
        break;
}

// Variables de jeu
// Variaveis do jogo
let attempts = 0;
const erreurs_autorisees = 10;
let wordDisplay = [];
let wordsUsed = []; // Liste pour mémoriser les mots déjà utilisés

// Fonction de sélection d'un nouveau mot pour éviter les répétitions excessives
// Nova função de seleção de palavras para evitar a repetição excessiva
function randomWords() {
    // Filtre les mots disponibles qui n'ont pas encore été utilisés
    // Filtra as palavras disponíveis que ainda não foram usadas
    const availableWords = wordsSecrets.filter(word => !wordsUsed.includes(word));

    // Si tous les mots ont été utilisés, redémarrez le cycle.
    // Se todas as palavras foram usadas, reinicia o ciclo
    if (availableWords.length === 0) {
        openModalContent("Congratulations!", "Tous les mots de ce niveau de difficulté ont déjà été utilisés ! Pensez à changer de niveau de difficulté.");
        // alert("Todas as palavras deste nível de dificuldade já foram usadas! Considere trocar o nível de dificuldade.");
        wordsUsed = [];
        return;
    }

    // Sélectionne un nouveau mot parmi ceux disponibles
    // Seleciona uma nova palavra dentre as disponíveis
    const newWord = availableWords[Math.floor(Math.random() * availableWords.length)];

    // Définir `wordSelect` et ajouter le mot choisi à la liste des mots utilisés
    // Define `wordSelect` e adiciona a palavra escolhida à lista de palavras usadas
    wordSelect = newWord;
    wordsUsed.push(newWord);

    // console.log("New word selected:", wordSelect);

    // Met à jour le `wordDisplay` pour le nouveau mot
    // Atualiza o `wordDisplay` para a nova palavra
    wordDisplay = Array(wordSelect.length).fill("_");
}

// Fonction de mise à jour de l'affichage des mots et tentatives
// Função para atualizar a exibição da palavra e tentativas
function updateDisplayWord() {
    containerWords.textContent = wordDisplay.join(" ");
    display_attemps.innerHTML = `<h3>Tentativas: ${attempts}</h3>`;
}

// Fonction pour gérer les clics sur les lettres
// Função para lidar com o clique nas letras
function handleLetterClick(event) {
    const wordSelected = event.target.textContent;
    let correct = false;

    // Vérifier si la lettre existe dans le mot
    // Verifica se a letra existe na palavra
    wordSelect.split("").forEach((letra, index) => {
        if (letra === wordSelected) {
            wordDisplay[index] = wordSelected;
            correct = true;
        }
    });

    if (!correct) {
        attempts++;
        penduImage.src = `img/pendu/forca0${attempts}.png`;
    }

    // Actualise l'affichage des mots
    // Atualiza a exibição da palavra
    updateDisplayWord();

    // Vérifier si vous avez gagné ou perdu
    // Verifica se ganhou ou perdeu
    verifyEndGame();

    // Désactiver le bouton
    // Desativa o botão
    event.target.disabled = true;
}

// Fonction permettant de vérifier la fin du jeu
// Função para verificar o fim do jogo
function verifyEndGame() {
    if (attempts >= erreurs_autorisees) {
        openModalContent("Try again!", "You've lost! The word was: " + wordSelect);
        setTimeout(refreshGame, 500); // Aguarda o modal fechar antes de reiniciar
    } else if (!wordDisplay.includes("_")) {
        openModalContent("Congratulations!", "You've guessed the word!");
        setTimeout(refreshGame, 500); // Aguarda o modal fechar antes de reiniciar
    }
}

// Fonction permettant de redémarrer le jeu
// Função para reiniciar o jogo
function refreshGame() {
    // Réactiver tous les boutons de lettres
    // Reativa todos os botões de letras
    document.querySelectorAll(".letter-button").forEach(button => {
        button.disabled = false;
    });

    // Réinitialisation des tentatives et de l'image
    // Reseta as tentativas e imagem
    attempts = 0;
    penduImage.src = `img/pendu/forca0.png`;

    // Sélectionne un nouveau mot et réinitialise `wordDisplay`.
    // Seleciona uma nova palavra e redefine `wordDisplay`
    randomWords();
    updateDisplayWord();
}

// Fonction de création de boutons de lettres
// Função para criar os botões de letras
function createButtons() {
    const containerDiv = document.createElement('div');
    containerDiv.className = "col";

    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(word => {
        const newButton = document.createElement('button');
        newButton.textContent = word;
        newButton.className = "letter-button mb-4";
        newButton.addEventListener('click', handleLetterClick);
        containerDiv.appendChild(newButton);
    });

    listWords.appendChild(containerDiv);
}

// Fonction permettant d'ouvrir la fenêtre modale avec du contenu
// Função para abrir o modal com conteúdo
function openModalContent(titulo, texto) {
    const modalTitle = modal.querySelector('h2');
    const modalSubTitle = modal.querySelector('p');
  
    // Modifie le contenu de la fenêtre modale
    // Altera o conteúdo do modal
    modalTitle.textContent = titulo;
    modalSubTitle.textContent = texto;
  
    // Ouvrir la fenêtre modale
    // Abre o modal
    modal.showModal();
}
  
// Fonction de fermeture de la fenêtre modale
// Função para fechar o modal
function closeModal() {
    modal.close();
}
  
// Fermez la fenêtre modale en cliquant en dehors de celle-ci
// Fechar o modal ao clicar fora dele
closeModalBtn.addEventListener('click', closeModal);

// Initialisation du jeu
// Inicialização do jogo
createButtons();

// Initialise avec un mot aléatoire
// Inicializa com uma palavra aleatória
randomWords(); 
updateDisplayWord();
