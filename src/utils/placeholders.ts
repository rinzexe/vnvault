const suggestionPlaceholders = [
    "Song of Saya",
    "Tsukihime",
    "Fate/Stay Night",
    "CLANNAD",
    "Steins;Gate",
    "Higurashi",
    "Umineko",
    "Muv-Luv",
    "Little Busters",
    "Chaos;Head",
    "Chaos;Child",
]

export function getRandomSuggestionPlaceholder() {
    return suggestionPlaceholders[Math.floor(Math.random() * suggestionPlaceholders.length)]
}