# BitBurner Idle Game Scripts
This repo is where I am keeping my scripts for the game [BitBurner](https://store.steampowered.com/app/1812820/Bitburner/).  The game uses a flat file structure; the folder structure in game is fake, so you can't just plop this repo into a game directory.

If it still works, this repo should use the [BitBurner VSCode extension](https://github.com/bitburner-official/bitburner-vscode) to import these files into the game.

## Files
This entire file structure and naming scheme was given no thought, and desparately needs an overhaul.  If I decide to play again I'll probably do that.

I am writing this out months after last playing, so notes may be inaccurate. 
- `actions/` Holds the small action scripts used by the hacking script
- `codingContracts/` Unused at the moment, but will hold the script that scan for and completes coding contracts
- `helpers/` Just some small helper scripts
  - `findServerPath.js`
    - Servers in this game are a tree, and this will print the path to a specific node given by name. Uses DFS to find the top to bottom path
  - `getServerTree.js`
    - Same idea as `findServerPath.js`, but will just print out the entire server tree structure.  Uses BFS to find the distance (depth) of each server
  - `openPorts.js`
    - Opens the ports on a target with every available attack `exe` you currently have
  - `scanForServers.js`
    - I don't remember, looks similar to `getServerTree.js`, but probably(?) had a different purpose
  - `serverSetup.js`
    - ! Important ! This script moves all the attack scripts over to a given server, then calls over to `openPorts.js` to start prepping for attacks
  - `sleep.js`
    - A different sleep method from the one the game engine gives.  If I remember this one is non-blocking on the thread where as the in-engine one isn't. (Could be wrong on that, but there was a good reason to have this over the given one)
- `serverLists/` The stuff in here is randomized per game, it is just some server names and metadata
- `startOfGame/` Unused currently, will hold scripts to jumpstart the run after reseting on a new BitNode
- `basicHack.js`
  - First hack written, basically from the wiki/guide. Will just dumbly attack a server endlessly
- `HackMaster.js`
  - "Smart" script that will find all reachable servers, best target server, and make everything start hacking that, but with a smart timing system. (This script "works", but there are some serious inconsistencies that happen on the target server I think)
- `hackOnRemote.js`
  - I don't remember what this was, it may just be a medium complexity script I wrote between `basicHack.js` and `HackMaster.js`