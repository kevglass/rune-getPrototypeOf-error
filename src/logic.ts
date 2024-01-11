import type { RuneClient } from "rune-games-sdk/multiplayer"

// An actor in our game world
export interface Actor {
  x: number;
  y: number;
}

// A world that contains a list of actors
export interface World {
  actors: Actor[];
}

// our multi-world game state - multiple levels 
// with players on each of them
export interface GameState {
  count: number
  worlds: World[];
}

type GameActions = {
  increment: (params: { amount: number }) => void
}

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

export function getCount(game: GameState) {
  return game.count
}

Rune.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  setup: (): GameState => {
    const world1: World = { actors: [] };

    const actor: Actor = { x: 1, y: 2 };
    world1.actors.push(actor);

    return { 
      count: 0,
      worlds: [world1]
    }
  },
  actions: {
    increment: ({ amount }, { game }) => {
      game.count += amount

      // this is what causes the issue, I'm wanting to spawn a new world
      // and then add an actor from the old world into the new world
      const actor = game.worlds[game.worlds.length - 1].actors[0];

      // I've tried doing this in different orders to see if 
      // its caused by losing references to the objects
      // or something but no luck
      game.worlds[game.worlds.length - 1].actors.splice(0, 1);
      const newWorld: World = { actors: [] };
      newWorld.actors.push(actor);
      game.worlds.push(newWorld);
    },
  },
})
