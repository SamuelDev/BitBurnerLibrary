/** @param {NS} ns
 * 0=target network
 * 1=true=use ownedservers, false=use remoteservers
 * 2=distance: number
 *   
 **/
export async function main(ns) {
    var hosts = [];
    if (!!ns.args[1]) {
        hosts = JSON.parse(ns.read('ownedServers.txt'));
    }
    else {
        hosts = JSON.parse(ns.read('remoteServers.txt'));
    }

    var target = ns.args[0];
    if (!await OpenPorts(ns, { name: target })) {
        ns.tprint('failed to open ports on ' + target);
        return;
    }

    for (let host of hosts) {
        if (host.hackingSkillReq > ns.getHackingLevel() || host.distance > ns.args[2] || host.RAM < 4 || !(await OpenPorts(ns, host)))
            continue;

        /** 
         * check memory amount used by script
         * divide memory on server by that amount, floor it, run with that many threads
         * getServerMemory(host)
        **/
        var numThreads = Math.floor(ns.getServerMaxRam(host.name) / ns.getScriptRam('basicHack.js', 'home'));

        // scp the script to the server and exec() it
        if (host.name !== 'home') {
            await ns.scp('basicHack.js', 'home', host.name);
            ns.killall(host.name);
            await ns.sleep(2000);
            ns.exec('basicHack.js', host.name, numThreads, target);
        }
        else {
            await ns.sleep(2000);
            ns.exec('basicHack.js', host.name, numThreads - 15, target);
        }
    }
}

/** @param {NS} ns **/
var OpenPorts = async function (ns, host) {
    if (host.name === 'home' || !!ns.args[1] || ns.hasRootAccess(host.name))
        return true;

    var openedPorts = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(host.name);
        await ns.sleep(100);
        openedPorts++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(host.name);
        await ns.sleep(100);
        openedPorts++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(host.name);
        await ns.sleep(100);
        openedPorts++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(host.name);
        await ns.sleep(100);
        openedPorts++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(host.name);
        await ns.sleep(100);
        openedPorts++;
    }
    if (!ns.hasRootAccess(host.name) && openedPorts >= ns.getServerNumPortsRequired(host.name)) {
        ns.nuke(host.name);
        await ns.sleep(500);
        return true;
    }
    ns.tprint('failed to nuke server: ' + host.name);
    return false;
}