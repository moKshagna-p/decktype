import TypingSession from '../../features/typing-session/typing-session'
import { getGameBySlug } from '../../entities/game/get-game-by-slug'

const gameDefinition = getGameBySlug('falling-words')

function GamePage() {
  if (!gameDefinition) {
    return null
  }

  return <TypingSession game={gameDefinition} />
}

export default GamePage
