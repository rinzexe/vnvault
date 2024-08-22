export function getCharacterRoleName(role:string) {
    return role == "main" ? "Main character" : role == "primary" ? "Primary character" : "Appearance"
}