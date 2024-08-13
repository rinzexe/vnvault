export function calculateLevel(xp: number) {
    let level = 1;
    let xpForNextLevel = 200;
    let remainingXP = xp;

    while (remainingXP >= xpForNextLevel) {
        remainingXP -= xpForNextLevel;
        level++;
        xpForNextLevel = Math.floor(xpForNextLevel * 1.2); 
    }

    return {
        level: level,
        xpForNextLevel,
        remainingXP
    };
}

export function calculateXpReward(votecount: number, streak: number) {
    var value = 1
    var iteration = 0
    while (iteration < streak) {
        value *= 1.8
        iteration++
    }
    return (50000 - votecount) / 1000 * value / 8;
}