import { gameRegistry } from './game-registry'

export function getGameBySlug(slug: string) {
  return gameRegistry.find((game) => game.slug === slug) ?? null
}
