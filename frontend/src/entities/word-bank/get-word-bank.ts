import { wordBankRegistry } from './word-bank-registry'

export function getWordBank(language: string) {
  return wordBankRegistry.find((wordBank) => wordBank.language === language) ?? null
}
