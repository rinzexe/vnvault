
export async function infiniteSearch(filters: any, endpoint: string, fields: string, results: number, sort: { type: string, asc: boolean }) {

    async function query(page: number, resultsAmount: number) {
        console.log("made a request")
        const res: any = await fetch('https://api.vndb.org/kana/' + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'filters': filters,
                'fields': fields,
                "count": true,
                "sort": sort.type,
                "reverse": !sort.asc,
                "results": resultsAmount,
                "page": 1 + page
            })
        });

        const json = await res.json()

        return json
    }

    const res = await query(0, results < 100 ? results : 100)

    var data: any = res.results
    var iterationCount = 1
    while (iterationCount * 100 < res.count && iterationCount * 100 < results) {
        const nextDataRes = await query(iterationCount, results - iterationCount * 100 < 100 ? results : 100)
        data = [...data, ...nextDataRes.results]
        iterationCount++
    }

    return data
}

export async function idSearch(ids: string[], endpoint: string, fields: string, sort?: { type: string, asc: boolean }) {
    var filter: any = ['or']

    ids.forEach((id) => {
        filter.push(['id', '=', id])
    })

    const res = await infiniteSearch(filter, endpoint, fields, 9999, sort ? sort : { type: 'rating', asc: false })

    return res
}