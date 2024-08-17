
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