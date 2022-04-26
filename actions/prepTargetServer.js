/** @param {import("../../").NS } ns */
export async function main(ns) {
    let target = ns.args[0];
    while (ns.getServerSecurityLevel(target) !== ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)) {
        if (ns.getServerSecurityLevel(target) !== ns.getServerMinSecurityLevel(target)) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) !== ns.getServerMaxMoney(target)) {
            await ns.grow(target);
        }

        await ns.sleep(2000);
    }
}