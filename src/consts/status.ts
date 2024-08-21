export default function getStatusName(id: number) {
    switch (id) {
        case 0: return "Read"
        case 1: return "Reading"
        case 2: return "To-read"
        case 3: return "Dropped"
    }
}