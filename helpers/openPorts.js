import { ServerConsts } from "/serverLists/serverConsts.js";

/**
* @param {NS} ns 
* @param { import("../..").Server } target 
* @returns { boolean }
**/
export async function OpenPorts(ns, target) {
    if (target.hostname === ServerConsts.homeName || target.purchasedByPlayer || ns.hasRootAccess(target.hostname)) {
        return true;
    }

    try {
        var openedPorts = 0;
        if (ns.fileExists("BruteSSH.exe", "home")) {
            ns.brutessh(target.hostname);
            await ns.sleep(25);
            openedPorts++;
        }
        if (ns.fileExists("FTPCrack.exe", "home")) {
            ns.ftpcrack(target.hostname);
            await ns.sleep(25);
            openedPorts++;
        }
        if (ns.fileExists("SQLInject.exe", "home")) {
            ns.sqlinject(target.hostname);
            await ns.sleep(25);
            openedPorts++;
        }
        if (ns.fileExists("HTTPWorm.exe", "home")) {
            ns.httpworm(target.hostname);
            await ns.sleep(25);
            openedPorts++;
        }
        if (ns.fileExists("relaySMTP.exe", "home")) {
            ns.relaysmtp(target.hostname);
            await ns.sleep(25);
            openedPorts++;
        }
        if (openedPorts >= ns.getServerNumPortsRequired(target.hostname)) {
            ns.nuke(target.hostname);
            await ns.sleep(25);
            return true;
        }
    } catch (e) {
        ns.tprint('Error opening ports on: ' + target.hostname);
        return false;
    }

    ns.tprint('failed to nuke server: ' + target.hostname);
    return false;
}