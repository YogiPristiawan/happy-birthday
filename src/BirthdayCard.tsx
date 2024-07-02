import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "./lib/utils"
import "./styles/birthday-card.css"
import { AppContext } from "./Context"
import { ImBookmark } from "react-icons/im";
import TypedWriter from "./components/TypedWriter";
import BaloonSpawner from "./BalloonSpawner"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import CatMail from "./assets/animation/cat-mail.json"
import CatBalloon from "./assets/animation/cat-balloon.json"

const renderPage = (page: number, handleNext: () => void, handleNextSection: () => void) => {
  switch (page) {
    case 0:
      return <FirstPage handleNext={handleNext} />
    case 1:
      return <SecondPage handleNext={handleNextSection} />
    default:
      throw new Error("invalid card page")
  }
}

const FirstPage = ({ handleNext }: { handleNext: () => void }) => {
  const targetName = import.meta.env.VITE_TARGET_NAME
  const [showText, setShowText] = useState(false)
  const [showNext, setShowNext] = useState(false)

  const handleShowText = () => {
    setTimeout(() => {
      setShowText(true)
    }, 700)
  }

  const handleShowNext = useCallback(() => {
    setTimeout(() => {
      setShowNext(true)
    }, 700)
  }, [])

  return (
    <>
      <TypedWriter
        text={`To: ${targetName}`}
        delay={80}
        callback={handleShowText}
        className="text-left mb-6 font-playwrite text-sm"
      />

      {
        showText && (
          <TypedWriter
            text="On this special day and beyond, I wish for you to always find joy in every moment. May all your dreams and aspirations come true, bringing you endless happiness."
            delay={80}
            callback={handleShowNext}
            className="font-playwrite leading-loose"
          />
        )
      }

      {
        showNext && (
          <button onClick={handleNext} className={cn(
            "underline underline-offset-2 cursor-pointer opacity-0 absolute bottom-9 right-4",
            {
              "[animation:fade-in_1s_ease-in_forwards]": showNext
            }
          )}>
            More {">>"}
          </button>
        )
      }
    </>
  )
}

const SecondPage = ({ handleNext }: { handleNext: () => void }) => {
  const [showNext, setShowNext] = useState(false)

  const handleShowNext = useCallback(() => {
    setTimeout(() => {
      setShowNext(true)
    }, 700)
  }, [])

  return (
    <>
      <TypedWriter
        text="May this birthday be the start of a year filled with love, laughter, and unforgettable memories. You deserve nothing but the best, now and always."
        delay={80}
        callback={handleShowNext}
        className="font-playwrite leading-loose"
      />

      {
        showNext && (
          <button onClick={handleNext} className={cn(
            "underline underline-offset-2 cursor-pointer opacity-0 absolute bottom-9 right-4",
            {
              "[animation:fade-in_1s_ease-in_forwards]": showNext
            }
          )}>
            More {">>"}
          </button>
        )
      }
    </>
  )
}

export default function BirthdayCard() {
  const targetName = import.meta.env.VITE_TARGET_NAME

  const birthDaryCardRef = useRef<HTMLDivElement>(null)

  const appContext = useContext(AppContext)
  const [cardOpen, setCardOpen] = useState(false)
  const [cardPage, setCardPage] = useState(0)

  const handleNextPage = () => {
    appContext.setState(prev => ({
      ...prev,
      page: 4
    }))
  }

  const handleCardPageNext = () => {
    setCardPage(prev => prev + 1)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!birthDaryCardRef.current || birthDaryCardRef.current.contains(event.target as Node)) return

      if (!cardOpen) return
      setCardOpen(false)
      setCardPage(0)
    }

    // document.addEventListener("click", listener, true)
    document.addEventListener('mouseup', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);

    return () => {
      // document.removeEventListener("click", listener, true)
      document.removeEventListener('mouseup', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    }
  }, [cardOpen])

  const handleOpenCard = () => {
    if (cardOpen) return

    setCardOpen(true)
    setCardPage(1)
  }
  console.log("PAGE", cardPage)

  return (
    <>
      <BaloonSpawner />

      <div className={cn(
        "bg-transparent h-screen",
        "flex items-center justify-center",
      )}>
        <div className={cn(
          "birthdayCard *:rounded-r-lg",
          {
            "[transform:perspective(2500px)_rotate(5deg)]": cardOpen,
            "[box-shadow:inset_100px_20px_100px_rgba(0,0,0,.2),_0_10px_100px_rgba(0,0,0,0.5)]": cardOpen
          }
        )}
          ref={birthDaryCardRef}
        >

          {/* cover */}
          <div className={cn(
            "cardFront",
            {
              "[transform:rotateY(-160deg)]": cardOpen
            }
          )}>
            <div className={cn(
              "happy",
              "mt-[30px] mx-[30px]",
              "text-sm p-2 rounded-lg font-semibold",
              {
                "invisible": cardOpen
              }
            )}>
              <p className="font-playwrite">
                Happy Birthday
              </p>
              <p className="font-playwrite mt-4">{targetName}</p>
            </div>

            {/* cat mail */}
            <div className={cn(
              "h-[80%] overflow-hidden absolute left-0 right-0 bottom-0",
              {
                // "invisible": cardOpen,
                "[animation:fade-out_0.2s_ease-in_forwards]": cardOpen,
              }
            )}>
              <DotLottieReact
                data={CatMail}
                loop
                autoplay
              />
            </div>

            {/* cat balloon */}
            <div className={cn(
              "h-[80%] overflow-hidden absolute left-0 right-0 top-0",
              {
                "invisible": !cardOpen,
                "[animation:fade-in_1s_ease-in_forwards]": cardOpen,
              }
            )}>
              <DotLottieReact
                data={CatBalloon}
                loop
                autoplay
              />
            </div>
          </div>
          <button onClick={handleOpenCard} className={cn(
            "bg-[#F7879A] pr-2 py-2",
            "absolute bottom-8 left-full flex items-center gap-1",
            "text-white text-xs rounded-r-lg",
            {
              "invisible": cardOpen
            }
          )}>
            <span>Open</span>
            <span><ImBookmark /></span>
          </button>

          {/* page */}
          <div className={cn(
            "absolute bg-[#F7879A] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
            "shadow-[inset_100px_20px_100px_rgba(0,0,0,0.2)]",
            "font-playwrite text-sm",
            "[transform-origin:left] [transition:.6s]",
            {
              "[transform:rotateY(-160deg)]": cardPage == 2
            }
          )}>
            {
              cardPage == 1 && (
                <FirstPage handleNext={handleCardPageNext} />
              )
            }
          </div>


          <div className={cn(
            "absolute bg-[#F7879A] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
            "shadow-[inset_100px_20px_100px_rgba(0,0,0,0.2)]",
            "font-playwrite text-sm",
            {
              "invisible": cardPage != 2
            }
          )}>
            {
              cardPage == 2 && (
                <SecondPage handleNext={handleNextPage} />
              )
            }
          </div>
        </div>
      </div>
    </>
  )
}
