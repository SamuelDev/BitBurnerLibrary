import { OpenPorts } from "/helpers/openPorts.js";
import { ServerConsts } from "/serverLists/serverConsts.js";

/** 
 * @param {import("../..").NS } ns 
 * @param { import("../..").Server } target 
 * @returns { boolean }
 **/
export async function ServerSetup(ns, target) {
    var actions = ['/actions/grow.js', '/actions/hack.js', '/actions/weaken.js', '/actions/weaken2.js', '/actions/monitor.js', '/actions/controller.js', '/actions/hwgw.js']
    if (target.hostname !== ServerConsts.homeName) {
        await ns.scp(actions, ServerConsts.homeName, target.hostname);
    }

    return await OpenPorts(ns, target);
}