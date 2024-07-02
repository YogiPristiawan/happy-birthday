import { createContext } from "react";

export type StateValue = {
  page: number
  answerText: string
  correctTargetName: boolean

  toggleAudioPlay: () => void
}

export type AppContextValue = {
  state: StateValue
  setState: React.Dispatch<React.SetStateAction<StateValue>>
}

export const AppContext = createContext<AppContextValue>({} as AppContextValue)
