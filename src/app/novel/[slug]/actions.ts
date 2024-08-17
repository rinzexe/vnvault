'use server'

export async function getGameLinks(query: string) {
    const steamRes: any = await fetch('https://steamcommunity.com/actions/SearchApps/' + query, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })



    const gogRes = await fetch('https://embed.gog.com/games/ajax/filtered?mediaType=game&search=' + query, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const steamJson: any = await steamRes.json()
    const gogJson = await gogRes.json()

    var object: any = {}

    if (steamJson[0]) {
        object['steam'] = "https://store.steampowered.com/app/" + steamJson[0].appid
    }

    if (gogJson.products[0]) {
        const preciseProduct = gogJson.products.find((product: any) => product.title == query)

        if (preciseProduct) {
            object['gog'] = "https://www.gog.com" + preciseProduct.url
        }
        else {
            object['gog'] = "https://www.gog.com" + gogJson.products[0].url
        }
    }

    return object
}