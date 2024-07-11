import { cn } from "./lib/utils"
import TypedWriter from "./components/TypedWriter"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { HiPaperAirplane } from "react-icons/hi2"
import { AppContext } from "./Context"
import { FaGift } from "react-icons/fa6";

type Question = {
  question: string
  answer: string
}

const questions: Question[] = [
  {
    question: "Siapa artis Hollywood yang aslinya orang Padang?",
    answer: "Nicki Minang"
  },
  {
    question: "Minuman apa yang Islami?",
    answer: "Nutrisyar'i"
  },
  {
    question: "Hewan apa yang gabisa ngomong?",
    answer: "Se-mute"
  },
  {
    question: "Tahu apa yang guedee banget?",
    answer: "Tahu isi Sumedang"
  }
]

type QuestionContextValue = {
  question: Question | null
  isAnswered: boolean
  isAnswerCorrect: boolean
}

const QuestionContext = createContext({} as QuestionContextValue)

type QuestionState = {
  question: Question | null
  isAnswered: boolean
  isAnswerCorrect: boolean
}

export default function Question() {
  const [answerValue, setAnswerValue] = useState("")
  const [showAnswerForm, setShowAnswerForm] = useState<boolean>(false)

  const questionRef = useRef(questions[Math.floor(Math.random() * questions.length)])

  const [state, setState] = useState<QuestionState>({
    isAnswered: false,
    isAnswerCorrect: false,
    question: null
  })

  useEffect(() => {
    setState(prev => ({
      ...prev,
      question: questionRef.current
    }))
  }, [])

  const handleShowAnswerForm = useCallback(() => {
    setShowAnswerForm(true)
  }, [])

  const handleAnswer = () => {
    const isAnswerCorrect = answerValue.toLowerCase() === questionRef.current.answer.toLowerCase()
    if (isAnswerCorrect) {
      setState(prev => ({
        ...prev,
        isAnswered: true,
        isAnswerCorrect: true
      }))
    } else {
      setState(prev => ({
        ...prev,
        isAnswered: true,
        isAnswerCorrect: false
      }))
    }
  }

  return (
    <>
      <QuestionContext.Provider value={state}>
        <div className={cn(
          "w-full border p-4 relative rounded-lg text-center",
          "md:max-w-[50%]"
        )}>
          {
            !state.isAnswered ?
              state.question && (
                <>
                  <TypedWriter
                    text={state.question.question}
                    delay={70}
                    onFinish={handleShowAnswerForm}
                    className="text-lg my-2"
                  />

                  {
                    showAnswerForm && (
                      <AnswerForm
                        handleChange={(value) => setAnswerValue(value)}
                        handleAnswer={handleAnswer}
                      />
                    )
                  }
                </>
              )
              : <QuestionResult />
          }
        </div>
      </QuestionContext.Provider>
    </>
  )
}

type AnswerFormProps = {
  handleChange: (v: string) => void
  handleAnswer: () => void
}

function AnswerForm(props: AnswerFormProps) {
  return (
    <div className="flex gap-2">
      <input type="text" className="border rounded-lg px-2 py-1 grow focus:outline-pink-300" autoFocus onChange={(e) => props.handleChange(e.target.value)} />
      <button className="bg-pink-400 rounded-full text-white p-2 hover:bg-pink-400/75" onClick={props.handleAnswer}>
        <HiPaperAirplane className="w-[20px] h-[20px]" />
      </button>
    </div>
  )
}

function QuestionResult() {
  const questionContext = useContext(QuestionContext)
  const appContext = useContext(AppContext)

  const handleOpenGift = () => {
    appContext.setState(prev => ({
      ...prev,
      page: 3
    }))
    appContext.state.toggleAudioPlay()
  }

  if (questionContext.isAnswerCorrect) {
    return (
      <>
        <p>YEAY Benar!!!</p>
        <p>Karena kamu udah berhasil jawab, aku mau kasih hadiah. Buka yaa..</p>

        <button className="bg-pink-400 hover:bg-pink-400/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4 animate-bounce" onClick={handleOpenGift}>
          <FaGift />
          <span>Buka</span>
        </button>
      </>
    )
  } else {
    return (
      <>
        <p>Salah 😆</p>
        <p>Jawabannya adalah: <span><b>{questionContext.question?.answer}</b></span></p>
        <p>Meskipun kamu ga berhasil jawab, aku bakal tetep kasih hadiah kok. Buka yaa...</p>

        <button className="bg-pink-400 hover:bg-pink-400/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4 animate-bounce" onClick={handleOpenGift}>
          <FaGift />
          <span>Buka</span>
        </button>
      </>
    )
  }
}
