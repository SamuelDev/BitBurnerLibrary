/** @param {import("../..").NS } ns */
export function main(ns) {
    // ns.tprint(GetServerTree(ns));
    ns.tprint(GetFlattenedServerTree(ns));
}

/** @param {import("../..").NS } ns */
export function GetServerTree(ns, excludePurchased = true) {
    let visited = [];
    let home = new ServerNode('home', 0, ns.getServer('home'));
    let queue = [home];

    while (queue.length > 0) {
        let server = queue.shift();

        if (visited.includes(server.name)) continue;
        visited.push(server.name);

        let connectedServers = ns.scan(server.name).filter(x => visited.indexOf(x) === -1)
        if (excludePurchased) {
            connectedServers = connectedServers.filter(x => !x.startsWith('dev-'));
        }
        connectedServers = connectedServers.map(x => new ServerNode(x, server.depth + 1, ns.getServer(x)));
        server.children.push(...connectedServers);

        queue = queue.concat(connectedServers);
    }

    return home;
}

/** @param {import("../..").NS } ns 
 * @returns {Server[]}
*/
export function GetFlattenedServerTree(ns, excludePurchased = true) {
    let tree = GetServerTree(ns, excludePurchased);
    let flattenedTree = [];
    let queue = [tree];

    while (queue.length > 0) {
        let node = queue.shift();
        flattenedTree.push(node.gameServerObj);

        queue = queue.concat(node.children);
    }

    return flattenedTree;
}

export class ServerNode {
    /** 
     * @param {ServerNode} node 
     * @param {number} depth
     * @param {import("../../").Server} gameServerObj
    */
    constructor(name, depth, gameServerObj) {
        /** @type {string} */
        this.name = name;
        /** @type {ServerNode[]} */
        this.children = [];
        /** @type {number} */
        this.depth = depth;
        /** @type {import("../../").Server} */
        this.gameServerObj = gameServerObj;
    }
}