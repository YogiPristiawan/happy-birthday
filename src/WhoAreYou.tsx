import { cn } from "./lib/utils"
import BlackKittenAnimation from "./assets/animation/black-kitten.json"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import TypedWriter from "./components/TypedWriter"
import { useCallback, useContext, useRef, useState } from "react"
import { HiPaperAirplane } from "react-icons/hi2";
import { AppContext } from "./Context"

function isNameCorrect(name: string): boolean {
  const targetName = import.meta.env.VITE_TARGET_NAME as string

  if (targetName.toLowerCase().includes(name.toLowerCase())) {
    return true
  }

  return false
}

export default function WhoAreYou() {
  const [showInput, setShowInput] = useState(false)
  const [input, setInput] = useState("")
  const [showErorrInput, setShowErrorInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const appContext = useContext(AppContext)

  const handleCallback = useCallback(() => {
    setShowInput(true)
  }, [])

  const handleAnswer = () => {
    if (!input) {
      setShowErrorInput(true)
      inputRef?.current?.focus()
      return
    }

    appContext.setState(prev => ({
      ...prev,
      page: 1,
      answerText: input,
      correctTargetName: isNameCorrect(input)
    }))
  }

  return (
    <div className={cn(
      "w-full border p-4 relative rounded-lg text-center",
      "md:max-w-[50%]"
    )}>
      <div className={cn(
        "h-[60px] overflow-visible absolute w-full bottom-full left-0"
      )}>
        <DotLottieReact
          data={BlackKittenAnimation}
          loop
          autoplay
          className={cn(
            "absolute left-0 bottom-0",
          )}
        />
      </div>

      <TypedWriter
        text="Haiii, nama kamu siapa?"
        delay={70}
        callback={handleCallback}
        className="text-lg my-2"
      />

      {
        showInput && (
          <>
            {showErorrInput && <p className="text-pink-400 text-xs text-left mt-6">Diisi dulu dong -_-</p>}

            <div className="flex gap-2">
              <input type="text" className="border rounded-lg px-2 py-1 grow focus:outline-pink-300" autoFocus onChange={(e) => setInput(e.target.value)} ref={inputRef} />
              <button className="bg-pink-400 rounded-full text-white p-2 hover:bg-pink-400/75" onClick={handleAnswer}>
                <HiPaperAirplane className="w-[20px] h-[20px]" />
              </button>
            </div>
          </>
        )
      }
    </div>
  )
}
