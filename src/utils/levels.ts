

export function calculateLevel(xp: number) {
    let level = 1;
    let xpForNextLevel = 200;
    let remainingXP = xp;

    while (remainingXP >= xpForNextLevel) {
        remainingXP -= xpForNextLevel;
        level++;
        xpForNextLevel = Math.floor(xpForNextLevel * 1.5); 
    }

    return {
        level: level,
        xpForNextLevel,
        remainingXP
    };
}