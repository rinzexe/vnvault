export function getVnLengthName(length: string) {
    var finalLength = "Very short"
    if (length == "2") {
        finalLength = "Short"
    }
    else if (length == "3") {
        finalLength = "Average"
    }
    else if (length == "4") {
        finalLength = "Long"
    }
    else if (length == "5") {
        finalLength = "Very long"
    }

    return finalLength
}