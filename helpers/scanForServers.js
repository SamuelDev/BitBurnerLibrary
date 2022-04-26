/** @param {import("../../").NS } ns */
export function main(ns) {
    let visited = [];
    let home = new ServerNode('home', 0);
    let queue = [home];

    while (queue.length > 0) {
        let server = queue.shift();

        if (visited.includes(server.name)) continue;
        visited.push(server.name);

        let connectedServers = ns.scan(server.name).filter(x => !x.startsWith('dev-') && visited.indexOf(x) === -1).map(x => new ServerNode(x, server.depth + 1));
        server.children.push(...connectedServers);

        queue = queue.concat(connectedServers);
    }

    ns.tprint(home);
}

export class ServerNode {
    constructor(name, depth) {
        this.name = name;
        this.children = [];
        this.depth = depth;
    }
}