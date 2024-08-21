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
                'fields': 'id, title, rating, titles.title, titles.lang, length, description, alttitle, image.url, length_minutes, tags.id, tags.name, tags.category',
                "count": true,
                "sort": sort?.type,
                "reverse": !sort?.asc,
                "results": 100,
                "page": 1 + page
            })
        });

        const json = await res.json()

        return json
    }

    const res = await query(0)

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
            'fields': 'id, title, titles.title, titles.lang, rating, length, description, alttitle, image.url',
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

export async function characterSearchByName(search: string, results: number) {
    const res: any = await fetch('https://api.vndb.org/kana/character', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': ['search', '=', search],
            'fields': 'id, name, vns.title, image.url',
            "count": true,
            "results": results,
        })
    });

    const json = await res.json()

    return json.results
}

export async function characterListSearchById(search: string[]) {
    var filter: any = ['or']

    search.forEach((s) => {
        filter.push(['id', '=', s])
    })

    async function query(page: number) {

        const res: any = await fetch('https://api.vndb.org/kana/character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'filters': filter,
                'fields': 'id, name, vns.title, description, original, image.url, height, weight, bust, waist, hips, cup, age, birthday, vns.id, vns.title, vns.image.url, vns.role',
                "count": true,
                "results": 100,
                "page": 1 + page
            })
        });
        const json = await res.json()

        return json
    }


    const res = await query(0)

    var vnData: any = res.results
    var iterationCount = 1
    while (iterationCount * 100 < res.count) {
        const vnDataRes2 = await query(iterationCount)
        vnData = [...vnData, ...vnDataRes2.results]
        iterationCount++
    }

    return vnData
}