export function getVaultStatusText(status: number) {
    switch (status) {
        case 0: {
            return "Finished"
        }
        case 1: {
            return "In progress"
        }
        case 2: {
            return "Not read"
        }
        case 3: {
            return "Dropped"
        }
    }
}