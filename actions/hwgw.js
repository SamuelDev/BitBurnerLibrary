/**
 * 0     1              2               3               4               5               6           7             8          9
 * i++, hackThreads, growthThreads, weaken1Threads, weaken2Threads, delay1TimeMs, delay2TimeMs, delay3TimeMs, targetName, hostName
 */
/** @param {import("../../").NS } ns */
export async function main(ns) {

    let i = ns.args[0];
    let hackThreads = ns.args[1];
    let growthThreads = ns.args[2];
    let weaken1Threads = ns.args[3];
    let weaken2Threads = ns.args[4];
    let delay1TimeMs = ns.args[5];
    let delay2TimeMs = ns.args[6];
    let delay3TimeMs = ns.args[7];
    let targetName = ns.args[8];
    let hostName = ns.args[9];

    ns.exec('/actions/weaken.js', hostName, weaken1Threads, targetName, i);
    // await ns.sleep(delay1TimeMs);
    ns.exec('/actions/weaken2.js', hostName, weaken2Threads, targetName, delay1TimeMs, i);
    // await ns.sleep(delay2TimeMs);
    ns.exec('/actions/grow.js', hostName, growthThreads, targetName, delay2TimeMs, i);
    // await ns.sleep(delay3TimeMs);
    ns.exec('/actions/hack.js', hostName, hackThreads, targetName, delay3TimeMs, i);
}