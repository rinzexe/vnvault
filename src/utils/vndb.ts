export async function vnListSearchById(search: string[], sort?: { type: string, asc: boolean }) {
    var filter: any = ['or']

    search.forEach((s) => {
        filter.push(['id', '=', s])
    })

    async function query(page: number) {
        const res: any = await fetch('https://api.vndb.org/kana/vn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'filters': filter,
                'fields': 'id, title, rating, length, description, alttitle, image.url, length_minutes',
                "count": true,
                "sort": sort?.type,
                "reverse": !sort?.asc,
                "results": 100,
                "page": 1
            })
        });

        const json = await res.json()

        return json
    }

    const res = await query(0)

    console.log(res)

    var vnData: any = res.results
    var iterationCount = 1
    while (iterationCount * 100 < res.count) {
        const vnDataRes2 = await query(iterationCount)
        vnData = [...vnData, ...vnDataRes2.results]
        iterationCount++
    }

    return vnData
}

export async function vnSearchByName(search: string, results: number, sort?: { type: string, asc: boolean }) {

    const res: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': ['search', '=', search],
            'fields': 'id, title, rating, length, description, alttitle, image.url',
            "count": true,
            "sort": sort?.type,
            "reverse": !sort?.asc,
            "results": results,
        })
    });

    const json = await res.json()

    return json.results
}

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