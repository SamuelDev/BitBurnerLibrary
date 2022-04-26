/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.85;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        var securityLevel = ns.getServerSecurityLevel(target) > securityThresh;
        var moneyLevel = ns.getServerMoneyAvailable(target) < moneyThresh;

        if (securityLevel) {
            await ns.weaken(target);
        } else if (moneyLevel) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}