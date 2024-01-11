import type { RuneClient } from "rune-games-sdk/multiplayer"

export interface Actor {
  x: number;
  y: number;
}

export interface World {
  actors: Actor[];
}

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

      const actor = game.worlds[game.worlds.length - 1].actors[0];
      game.worlds[game.worlds.length - 1].actors.splice(0, 1);

      const newWorld: World = { actors: [] };
      newWorld.actors.push(actor);
      game.worlds.push(newWorld);
    },
  },
})
