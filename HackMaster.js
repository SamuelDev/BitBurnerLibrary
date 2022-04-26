import { ServerConsts } from "/serverLists/serverConsts.js";
// import { OwnedServers } from "/serverLists/ownedServers.js";
// import { RemoteServers } from "/serverLists/remoteServers.js";
import { ServerSetup } from "/helpers/serverSetup.js";
import { GetFlattenedServerTree } from "/helpers/getServerTree.js";

const homeThreadMultiplier = 0.9;

/** @param {import("../").NS } ns */
export async function main(ns) {
    let allServers = GetFlattenedServerTree(ns, false);
    let playerHackLevel = ns.getHackingLevel();

    // Only get the servers I have the ability to hack
    let validTargets = allServers.filter(x => x.requiredHackingSkill <= playerHackLevel);
    let validTargets2 = []

    for (let target of validTargets) {
        if (await ServerSetup(ns, target)) {
            validTargets2.push(target);
        }
    }
    validTargets = validTargets2;

    // Find the best server to hack on 
    let bestServer = GetBestServer(ns, validTargets);

    // Prep the target server, send all servers at it for weak/grow and then wait for the target server to hit min/max values
    for (let host of validTargets) {
        let threads = 0;

        if (host.maxRam === 0) continue;

        // send PrepTargetServer to the host, if host is not home. Have it target the bestServer
        if (host.hostname !== ServerConsts.homeName) {
            ns.killall(host.hostname);
            await ns.scp('/actions/prepTargetServer.js', ServerConsts.homeName, host.hostname);
            threads = Math.floor(ns.getServerMaxRam(host.hostname) / ns.getScriptRam('/actions/prepTargetServer.js', ServerConsts.homeName));
        }
        else {
            threads = Math.floor((ns.getServerMaxRam(host.hostname) - ns.getServerUsedRam(host.hostname)) / ns.getScriptRam('/actions/prepTargetServer.js', ServerConsts.homeName) * homeThreadMultiplier);
        }

        if (threads < 1) {
            continue;
        }

        ns.exec('/actions/prepTargetServer.js', host.hostname, threads, bestServer.hostname);
    }

    // Wait until the target server hits min/max values
    while (ns.getServerSecurityLevel(bestServer.hostname) !== bestServer.minDifficulty || ns.getServerMoneyAvailable(bestServer.hostname) !== bestServer.moneyMax) {
        ns.print("Waiting for " + bestServer.hostname + " to hit min/max values");
        await ns.sleep(30000);
    }

    // With the target server at min/max values, kill any remaining running prep scripts
    for (let host of validTargets) {
        ns.kill('/actions/prepTargetServer.js', host.hostname, bestServer.hostname)
    }

    // Send controller to each server and execute it
    // thread math needs to happen in the controller
    // Timing calculations can be done here and passed to the controller
    let actionDelay = 50;
    let weakenTime = ns.getWeakenTime(bestServer.hostname);
    let weaken2DelayTime = (actionDelay * 2);
    let growDelayTime = weakenTime - ns.getGrowTime(bestServer.hostname) - actionDelay;
    let hackDelaytime = weakenTime - ns.getHackTime(bestServer.hostname) - growDelayTime - (actionDelay * 3);

    // I decided I only want to run hwgw on player owned servers for now
    validTargets = validTargets.filter(x => x.purchasedByPlayer === true);

    for (let host of validTargets) {
        ns.exec('/actions/controller.js', host.hostname, undefined, bestServer.hostname, weaken2DelayTime, growDelayTime, hackDelaytime, JSON.stringify(ns.getServer(host.hostname)));
    }
}

/** @param {import("../").NS } ns */
function GetBestNServers(ns, servers, n) {
    if (servers.length < 1 || n < 1) {
        throw "GetBestNServers: invalid parameters";
    }

    var bestServers = [];

    // Calculate heuristic scores for each server
    var player = ns.getPlayer();
    for (let validTarget of servers) {
        let formulaCalc = 0;

        // If Formulas.exe exists, use it to calculate a more accurate heuristic score
        if (ns.fileExists('Formulas.exe', ServerConsts.homeName)) {
            let serverObj = ns.getServer(validTarget.hostname);
            serverObj.hackDifficulty = serverObj.minDifficulty;
            formulaCalc = (serverObj.moneyMax / ns.formulas.hacking.weakenTime(serverObj, player)) * ns.formulas.hacking.hackChance(serverObj, player);

            if (ns.formulas.hacking.hackChance(serverObj, player) === 1) {
                bestServers.push({ "heuristic": formulaCalc, "server": validTarget });
            }
        }
        else {
            formulaCalc = (validTarget.moneyMax / ns.getWeakenTime(validTarget.hostname)) * ns.hackAnalyzeChance(validTarget.hostname);
        }


    }

    bestServers = bestServers.filter(x => x.server)
    bestServers.sort((a, b) => b.heuristic - a.heuristic);

    return bestServers.slice(0, n).map(x => x.server);
}

function GetBestServer(ns, servers) {
    return GetBestNServers(ns, servers, 1)[0];
}