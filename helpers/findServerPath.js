import { GetServerTree, ServerNode } from '/helpers/getServerTree.js';

/** @param {import("../../").NS } ns */
export function main(ns) {
    console.log(ns.getServer('home'));
    ns.tprint(FindServerPath(ns));
}

// args[0] = serverName
/** @param {import("../../").NS } ns */
export function FindServerPath(ns) {
    let serverName = ns.args[0];
    let tree = GetServerTree(ns);
    let path = [];

    let res = FindServerPathDFS(serverName, tree, path);
    return path;
}

/**
 * 
 * @param {string} serverName 
 * @param {ServerNode} node 
 * @param {string[]} path 
 * @returns {boolean}
 */
function FindServerPathDFS(serverName, node, path) {
    if (node.name.toLowerCase() === serverName.toLowerCase()) {
        path.unshift(node.name);
        return true;
    }
    else if (node.children.length === 0) {
        return false;
    }

    for (let child of node.children) {
        let result = FindServerPathDFS(serverName, child, path);
        if (result) {
            path.unshift(node.name);
            return result;
        }
    }

    return false;
}