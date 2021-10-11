const translateFrList = {
  AVAILABLE: "Disponible",
  USED: "Utilisé",
  NONE: " ",
};

export function translate(word, language) {
  return translateFrList[word] || word;
}
