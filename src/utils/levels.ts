

export function calculateLevel(xp: number) {
    let level = 1;
    let xpForNextLevel = 200; // XP required to reach level 2
    let remainingXP = xp;

    // Loop to determine the current level based on total XP
    while (remainingXP >= xpForNextLevel) {
        remainingXP -= xpForNextLevel;
        level++;
        xpForNextLevel = Math.floor(xpForNextLevel * 1.2); // Increase XP requirement by 1.5x
    }

    return {
        level: level,
        xpForNextLevel,
        remainingXP
    };
}