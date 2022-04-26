/**
 * args[0] = best server name
 * args[1] = delay between weaken 1 and 2
 * args[2] = delay between weaken 2 and grow
 * args[3] = delay between grow and hack
 * args[4] = RAM usage for hwgw
 * args[5] = server object for current server
 * @param {import("../../").NS } ns
 */
export async function main(ns) {
    let homeName = 'home';
    let targetName = ns.args[0];
    let delay1TimeMs = ns.args[1];
    let delay2TimeMs = ns.args[2];
    let delay3TimeMs = ns.args[3];
    let hostServerObject = JSON.parse(ns.args[4]);

    // calculate threads here, abstract them into a different script to free up ram
    let securityIncPerHackThread = 0.002; // 25 per weaken
    let securityIncPerGrowthThread = 0.004; // 50 per weaken
    let securityDecPerWeakenThread = 0.05;

    let hackThreads = 25;
    let hackAmountStolenPercentage = (ns.hackAnalyze(targetName) * hackThreads);
    let hackStolenAmount = hackAmountStolenPercentage * ns.getServerMoneyAvailable(targetName);
    let remainingMoney = ns.getServerMoneyAvailable(targetName) - hackStolenAmount;
    let growthNeededAmount = ns.getServerMoneyAvailable(targetName) / remainingMoney;
    let growthThreads = Math.ceil(ns.growthAnalyze(targetName, growthNeededAmount, hostServerObject.hostname === homeName ? hostServerObject.cpuCores : 1));

    // TODO: redo this math so home cores are taken into account
    let weaken1Threads = Math.ceil((securityIncPerHackThread * hackThreads) / securityDecPerWeakenThread);
    let weaken2Threads = Math.ceil((securityIncPerGrowthThread * growthThreads) / securityDecPerWeakenThread);

    let totalRamUsage = (ns.getScriptRam('/actions/hack.js', homeName) * hackThreads) +
        (ns.getScriptRam('/actions/grow.js', homeName) * growthThreads) +
        (ns.getScriptRam('/actions/weaken.js', homeName) * weaken1Threads) +
        (ns.getScriptRam('/actions/weaken2.js', homeName) * weaken2Threads);

    let i = 1;
    while (true) {
        if (hostServerObject.maxRam - ns.getServerUsedRam(hostServerObject.hostname) > totalRamUsage) {
            ns.exec('/actions/hwgw.js', hostServerObject.hostname, undefined, i++, hackThreads, growthThreads, weaken1Threads, weaken2Threads, delay1TimeMs, delay2TimeMs, delay3TimeMs, targetName, hostServerObject.hostname);
            await ns.sleep(50);
        }
        else {
            await ns.sleep(2000);
        }
        if (i > Number.MAX_SAFE_INTEGER - 5000) {
            i = 0;
        }
    }

    function getWeakenThreadsNeeded(server,) {
        const securityLevelAdjustment = 0.05;
        let difficultyDelta = server.hackDifficulty - server.minDifficulty;

        return Math.ceil(difficultyDelta / securityLevelAdjustment);
    }

}