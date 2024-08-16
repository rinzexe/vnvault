'use server'

export async function getVnData(name: string) {
    const res: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'filters': [
                "and", ['search', '=', name]
            ],
            'fields': 'id, title, titles.title, titles.lang, rating, released, votecount, length, description, alttitle, image.url, tags.name, tags.category, tags.description, developers.name, developers.original, languages, length_minutes, devstatus, olang, screenshots.sexual, screenshots.url',
            "results": "1",
        })
    });

    const json = await res.json()

    return json.results[0]
}

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

    const steamJson = await steamRes.json()
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