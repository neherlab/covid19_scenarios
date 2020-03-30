export interface SavedScenario {
  id: string
  userid: string
  name: string
  serializedScenario: string | null
}

export type ActiveScenario = SavedScenario
