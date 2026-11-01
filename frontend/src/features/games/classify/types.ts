export interface ClassifyItem {
  text: string
  group: number // índice en "groups"
}

export interface ClassifyGame {
  id: string
  title: string
  level: 'primaria' | 'secundaria'
  icon: string
  color: 'yellow' | 'green' | 'pink' | 'blue'
  groups: string[]
  items: ClassifyItem[]
}
