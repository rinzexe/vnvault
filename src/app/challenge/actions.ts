'use server'

export async function getRandomPanel(streak: number) {
    const filter = ['votecount', '>', Math.floor(8000 / (1 + streak / 2)).toString()]
    const res1: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': [
                "and", ['has_screenshot', '=', '1'], filter
            ],
            "results": "10",
            "page": "1",
            'fields': 'title',
            "count": true
        })
    });

    const res1json = await res1.json()

    const res2: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': [
                "and", ['has_screenshot', '=', '1'], filter
            ],
            'fields': 'title, alttitle, image.url, screenshots.url, screenshots.sexual, votecount',
            "results": "1",
            "page": Math.floor(Math.random() * res1json.count + 1),
            "count": true
        })
    });

    const res2json = await res2.json()
    

    var screenshotUrl

    var ssfound = false

    while (ssfound == false) {
        const rand = Math.floor(Math.random() * res2json.results[0].screenshots.length)
        if (res2json.results[0].screenshots[rand].sexual < 1) {
            ssfound = true
            screenshotUrl = res2json.results[0].screenshots[rand].url
        }
    }

    return ({ alttitle: res2json.results[0].alttitle, title: res2json.results[0].title, screenshot: screenshotUrl, votecount: res2json.results[0].votecount })
}

export async function getAutofillSuggestions(input: string) {
    const res: any = await fetch('https://api.vndb.org/kana/vn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'filters': [
                "and", ['has_screenshot', '=', '1'], ['search', '=', input]
            ],
            'fields': 'title, votecount, alttitle, image.url',
            "results": "3",
        })
    });

    const json = await res.json()

    return json.results
}