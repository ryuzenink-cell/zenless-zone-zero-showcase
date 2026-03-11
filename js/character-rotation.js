document.addEventListener("DOMContentLoaded", () => {
  const characterImg = document.querySelector(".character-rotation");

  if (!characterImg) return;

  const characters = [
    "anby",
    "billy-kid",
    "burnice",
    "nicole",
    "ellen",
    "jane",
    "ju-fufu"
  ];

  const lastCharacter = localStorage.getItem("zzz-last-character");

  let availableCharacters = characters;

  if (characters.length > 1 && lastCharacter) {
    availableCharacters = characters.filter(
      (character) => character !== lastCharacter
    );
  }

  const randomIndex = Math.floor(Math.random() * availableCharacters.length);
  const selectedCharacter = availableCharacters[randomIndex];

  characterImg.src = `assets/images/characters/${selectedCharacter}.png`;
  characterImg.alt = formatCharacterName(selectedCharacter);

  localStorage.setItem("zzz-last-character", selectedCharacter);

  function formatCharacterName(fileName) {
    return fileName
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
});