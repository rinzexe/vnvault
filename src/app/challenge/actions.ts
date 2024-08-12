'use server'

import axios from "axios";

const filter = ['votecount', '>', "8000"]

export async function getRandomPanel() {
    const res1: any = await axios.post(
        'https://api.vndb.org/kana/vn',
        {
            'filters': [
                "and", ['has_screenshot', '=', '1'], filter
            ],
            "results": "10",
            "page": "1",
            'fields': 'title',
            "count": true
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const res2: any = await axios.post(
        'https://api.vndb.org/kana/vn',
        {
            'filters': [
                "and", ['has_screenshot', '=', '1'], filter
            ],
            'fields': 'title, alttitle, image.url, screenshots.url, screenshots.sexual, votecount',
            "results": "1",
            "page": Math.floor(Math.random() * res1.data.count + 1),
            "count": true
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    var screenshotUrl

    var ssfound = false

    while (ssfound == false) {
        const rand = Math.floor(Math.random() * res2.data.results[0].screenshots.length)
        if (res2.data.results[0].screenshots[rand].sexual < 1) {
            ssfound = true
            screenshotUrl = res2.data.results[0].screenshots[rand].url
        }
    }

    return ({ alttitle: res2.data.results[0].alttitle, title: res2.data.results[0].title, screenshot: screenshotUrl })
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
            'fields': 'title, alttitle, image.url',
            "results": "3",
        })
    });

    const json = await res.json()

    return json.results
}