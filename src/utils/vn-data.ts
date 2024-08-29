export function getEnglishTitle(vnData: any) {
    if (vnData.titles) {
        const englishTitle = vnData.titles.find((title: any) => title.lang == "en")

        var mainTitle = vnData.title

        if (englishTitle) {
            mainTitle = englishTitle.title
        }

        return mainTitle
    }
    else {
        return vnData.title
    }
}