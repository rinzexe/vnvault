
export async function vnListSearchById(search: string[], results: number, sort?: { type: string, asc: boolean }) {
    var filter: any = ['or']

    search.forEach((s) => {
        filter.push(['id', '=', s])
    })

    const res: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': filter,
            'fields': 'id, title, rating, length, description, alttitle, image.url',
            "count": true,
            "sort": sort?.type,
            "reverse": !sort?.asc,
            "results": results,
        })
    });

    const json = await res.json()

    return json
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