let currentLevel = 1;
let timer;
let targetsRemaining;

const levels = {
  getLevelConfig(level) {
    const greenTargets = 3 + (level - 1) * 3; // Augmentation de 3 boutons verts par niveau
    const redTargets = greenTargets - 2; // Boutons rouges = boutons verts - 2
    const time = Math.max(15, 30 - level * 2); // Réduction de 2 secondes par niveau
    const speed = Math.max(500, 1500 - level * 150); // Augmentation de 150ms par niveau
    return { greenTargets, redTargets, time, speed };
  },
};

const motivationalQuotesFailure = [
  "Ne lâche pas, chaque échec est une étape vers le succès.",
  "La persévérance transforme l'échec en réussite.",
  "Un échec n'est qu'une opportunité de recommencer de manière plus intelligente.",
  "Les plus grandes réussites naissent des plus grands défis.",
  "Continue d'avancer, même si c'est difficile. Tu es plus fort que tu ne le penses."
];

const motivationalQuotesSuccess = [
  "Félicitations ! La persévérance est la clé du succès.",
  "Chaque victoire est une preuve de ton potentiel illimité.",
  "Tu as surmonté les obstacles avec brio. Continue comme ça !",
  "Le succès est la somme de petits efforts répétés jour après jour.",
  "Tu as prouvé que rien n'est impossible avec de la détermination."
];

const startGameBtn = document.getElementById("startGame");
const gameArea = document.getElementById("gameArea");
const gameDiv = document.querySelector(".game");
const containerDiv = document.querySelector(".container");
const messageDiv = document.querySelector(".message");
const congratsMessage = document.getElementById("congratsMessage");
const motivationalQuote = document.getElementById("motivationalQuote");
const nextLevelBtn = document.getElementById("nextLevel");
const levelTitle = document.getElementById("levelTitle");
const timerText = document.getElementById("timer");

startGameBtn.addEventListener("click", () => {
  containerDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");
  startLevel(currentLevel);
});

nextLevelBtn.addEventListener("click", () => {
  messageDiv.classList.add("hidden");
  gameDiv.classList.remove("hidden");
  startLevel(currentLevel);
});

function startLevel(level) {
  clearInterval(timer);
  levelTitle.textContent = `Niveau ${level}`;
  gameArea.innerHTML = "";

  const { greenTargets, redTargets, time, speed } = levels.getLevelConfig(level);
  targetsRemaining = greenTargets;

  startTimer(time);
  spawnTargets(greenTargets, redTargets, speed);
}

function spawnTargets(greenCount, redCount, speed) {
  const totalButtons = greenCount + redCount;
  let buttons = 0;

  // Créer un tableau mélangé de boutons verts et rouges
  const buttonTypes = Array(greenCount).fill(false).concat(Array(redCount).fill(true));
  shuffleArray(buttonTypes);

  console.log(`Début de la génération des boutons : ${totalButtons} boutons à générer.`);

  const targetInterval = setInterval(() => {
    if (buttons >= totalButtons) {
      console.log("Tous les boutons ont été générés.");
      clearInterval(targetInterval);
    } else {
      const isFake = buttonTypes[buttons];
      console.log(`Génération du bouton ${buttons + 1} : ${isFake ? "Rouge" : "Vert"}`);
      createButton(isFake);
      buttons++;
    }
  }, speed);
}

// Fonction pour mélanger un tableau ```javascript
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function createButton(isFake) {
    const button = document.createElement("div");
    button.className = isFake ? "lightGreenTarget" : "greenTarget"; // Utilisation de la nouvelle classe
    button.style.top = `${Math.random() * 350}px`;
    button.style.left = `${Math.random() * 550}px`;
  
    button.addEventListener("click", () => {
      if (isFake) {
        restartLevel(); // Redémarrer si bouton vert clair cliqué
      } else {
        targetsRemaining--;
        button.remove();
  
        if (targetsRemaining === 0) {
          clearInterval(timer);
          if (currentLevel < 5) {
            currentLevel++;
            showEndLevelMessage(false); // Passer au niveau suivant
          } else {
            showEndLevelMessage(true); // Fin du jeu si dernier niveau terminé
          }
        }
      }
    });
  
    gameArea.appendChild(button);
  
    // Augmenter la durée de vie des boutons
    setTimeout(() => button.remove(), 5000); // Les boutons restent visibles pendant 5 secondes
  }

function startTimer(seconds) {
  let timeLeft = seconds;
  timerText.textContent = `Temps restant : ${timeLeft}s`;
  clearInterval(timer);

  console.log(`Démarrage du chrono : ${timeLeft} secondes.`);

  timer = setInterval(() => {
    timeLeft--;
    timerText.textContent = `Temps restant : ${timeLeft}s`;

    if (timeLeft <= 0) {
      console.log("Temps écoulé.");
      clearInterval(timer);
      if (targetsRemaining > 0) {
        console.log("Redémarrage du niveau car il reste des boutons verts.");
        restartLevel(); // Redémarrer le niveau si temps écoulé et boutons verts restants
      }
    }
  }, 1000);
}

function restartLevel() {
  clearInterval(timer);
  gameArea.innerHTML = "";
  congratsMessage.textContent = "Oups ! Essaie encore.";
  motivationalQuote.textContent = motivationalQuotesFailure[Math.floor(Math.random() * motivationalQuotesFailure.length)]; // Citation aléatoire en cas d'échec
  nextLevelBtn.textContent = "Recommencer le Niveau";
  messageDiv.classList.remove("hidden");
  gameDiv.classList.add("hidden");
}

function showEndLevelMessage(isFinalLevel) {
  gameDiv.classList.add("hidden");
  messageDiv.classList.remove("hidden");

  if (isFinalLevel) {
    congratsMessage.textContent = "Félicitations ! Tu as terminé tous les niveaux !";
    motivationalQuote.innerHTML = `
      Chaque niveau de ce jeu peut être représenté comme étant une étape de la vie. <br>
      Parfois, c'est facile, d'autres fois, c'est difficile. Mais avec de la persévérance et de la concentration, tu peux surmonter tous les obstacles. <br><br>
      Les défis augmentent, mais à chaque réussite, la satisfaction est immense. Rappelle-toi toujours que l'effort mène à la croissance et que les échecs ne sont qu'un moyen d'apprendre et de s'améliorer. <br><br>
      <strong>Continue à avancer, car le voyage en vaut toujours la peine.</strong>
    `;
    nextLevelBtn.textContent = "Rejouer le jeu";
    nextLevelBtn.classList.remove("hidden");
    nextLevelBtn.addEventListener("click", () => {
      currentLevel = 1;
      messageDiv.classList.add("hidden");
      gameDiv.classList.remove("hidden");
      startLevel(currentLevel);
    });
  } else {
    congratsMessage.textContent = "Félicitations ! Tu as réussi !";
    motivationalQuote.textContent = motivationalQuotesSuccess[Math.floor(Math.random() * motivationalQuotesSuccess.length)];
    nextLevelBtn.textContent = "Passer au niveau suivant";
  }
}