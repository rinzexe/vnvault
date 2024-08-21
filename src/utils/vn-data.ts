export function getEnglishTitle(vnData: any) {
    const englishTitle = vnData.titles.find((title: any) => title.lang == "en")

    var mainTitle = vnData.title

    if (englishTitle) {
        mainTitle = englishTitle.title
    }

    return mainTitle
}