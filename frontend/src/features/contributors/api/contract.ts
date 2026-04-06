export type Contributor = {
  login: string
  displayName: string | null
  avatarUrl: string
  profileUrl: string
  contributions: number
}

export type ContributorsResponse = {
  contributors: Contributor[]
  syncedAt: string | null
}
