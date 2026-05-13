export type UserCard = {
  title: string
  indicator: string
  count: number
  description: string
  tone: 'warning' | 'info' | 'success' | 'neutral' | 'accent'
}