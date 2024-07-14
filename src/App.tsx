import { cn } from "./lib/utils"
import WhoAreYou from "./WhoAreYou"
import { AppContext, StateValue } from "./Context"
import { useState } from "react"
import Question from "./Question"
import AskForQuestion from "./AskForQuestion"
import BirthdayCard from "./BirthdayCard"
import Flower from "./Flower"
import useAudioPlayer from "./hooks"
import audio from "./assets/audio/audio-uncut.mp3"

function renderPage(page: number) {
  switch (page) {
    case 0:
      return (
        <div className={cn(
          "w-[85%] mx-auto h-screen",
          "grid place-items-center",
          "md:w-[65%]"
        )}>
          <WhoAreYou />
        </div>
      )
    case 1:
      return (
        <div className={cn(
          "w-[85%] mx-auto h-screen",
          "grid place-items-center",
          "md:w-[65%]"
        )}>
          <AskForQuestion />
        </div>
      )
    case 2:
      return (
        <div className={cn(
          "w-[85%] mx-auto h-screen",
          "grid place-items-center",
          "md:w-[65%]"
        )}>
          <Question />
        </div>
      )
    case 3:
      return <BirthdayCard />
    case 4:
      return <Flower />
    default:
      throw new Error("invalid page")
  }
}

function App() {
  const { togglePlay } = useAudioPlayer({
    src: audio,
    loop: true
  })
  const [state, setState] = useState<StateValue>({
    page: 0,
    answerText: "",
    correctTargetName: false,
    toggleAudioPlay: togglePlay
  })

  return (
    <AppContext.Provider value={{ state, setState }}>

      {renderPage(state.page)}

    </AppContext.Provider >
  )
}

export default App
