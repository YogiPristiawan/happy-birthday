import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "./lib/utils"
import "./styles/birthday-card.css"
import { AppContext } from "./Context"
import { ImBookmark } from "react-icons/im";
import TypedWriter from "./components/TypedWriter";
import BaloonSpawner from "./BalloonSpawner"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

import CatMail from "./assets/animation/cat-mail.json"
import CatBalloon from "./assets/animation/cat-balloon.json"
import CatPencil from "./assets/animation/cat-pencil.json"

const targetName = import.meta.env.VITE_TARGET_NAME

type GreetingPage = {
  sheetNumber: number
  paragraphs: string[]
  backPageAnimation?: JSX.Element
}

const greetingPages: GreetingPage[] = [
  {
    sheetNumber: 1,
    paragraphs: [
      `To: ${targetName}`,
      `On this special day and beyond, I wish for you to always find joy in every moment. May all your dreams and aspirations come true, bringing you endless happiness.`
    ],
    backPageAnimation: (
      <DotLottieReact
        data={CatPencil}
        autoplay
        loop
      // className="[transform:rotateY(-160deg)]"
      />
    )
  },
  {
    sheetNumber: 2,
    paragraphs: [
      `May this birthday be the start of a year filled with love, laughter, and unforgettable memories. You deserve nothing but the best, now and always.`
    ],
    backPageAnimation: (
      <DotLottieReact
        data={CatBalloon}
        autoplay
        loop
      />
    )
  },
  {
    sheetNumber: 3,
    paragraphs: [
      "Life's a rollercoaster, but you've got the strength to ride through the ups and downs. Keep smiling, keep shining, and know that brighter days are always ahead.",
      "You’re stronger than you think. You've got this!."
    ],
    backPageAnimation: (
      <DotLottieReact
        data={CatMail}
        autoplay
        loop
      // className="[transform:rotateY(-160deg)]" 
      />
    )
  },
  {
    sheetNumber: 4,
    paragraphs: [
      "Cheers to another trip around the sun! Here's to more adventures, more laughs, and making even more amazing memories.",
    ],
    backPageAnimation: (
      <DotLottieReact
        data={CatMail}
        autoplay
        loop
      // className="[transform:rotateY(-160deg)]" 
      />
    )
  },
  {
    sheetNumber: 5,
    paragraphs: [
      "Here's to another year of chasing dreams and making memories.",
      "Happy birthday, and may your days be as awesome as you are!"
    ]
  }
]

type GreetingCardPageContexValue = {
  rightSheet: number
  nextSection: () => void
  nextPage: () => void
}

const GreetingCardPageContext = createContext({} as GreetingCardPageContexValue)

type GreetingCardPageProps = {
  paragraphs: string[]
  sheetNumber: number
  isLastSheet: boolean
  isFlipped?: boolean
  backPageAnimation?: JSX.Element
}

const GreetingCardPage = (props: GreetingCardPageProps) => {
  const [showNextPageButton, setShowNextPageButton] = useState(false)
  const [currentParagraphIdx, setCurrentParagraphIdx] = useState(0)

  const cardContext = useContext(GreetingCardPageContext)

  const handleShowNextPageButton = useCallback(() => {
    setTimeout(() => {
      setShowNextPageButton(true)
    }, 700)
  }, [])

  const handleShowNextParagraph = useCallback(() => {
    setTimeout(() => {
      setCurrentParagraphIdx(prev => prev + 1)
    }, 1000)
  }, [])

  return (
    <>
      <div className={cn(
        "absolute bg-[#F7879A] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
        "shadow-[inset_100px_20px_100px_rgba(0,0,0,0.2)]",
        "font-playwrite text-sm",
        "z-10",
        "[transform-origin:left] [transition:.6s]",
        {
          "[transform:rotateY(-160deg)]": props.isFlipped, // flip
          "hidden": cardContext.rightSheet >= (props.sheetNumber + 2)
        }
      )}>
        {
          props.paragraphs.slice(0, currentParagraphIdx + 1).map((paragraph, i) => {
            return (
              <TypedWriter
                key={i}
                text={paragraph}
                delay={60}
                onFinish={i === props.paragraphs.length - 1 ? handleShowNextPageButton : handleShowNextParagraph}
                className={cn(
                  "text-left mb-6 font-playwrite text-sm",
                  "font-playwrite leading-loose",
                  {
                    "invisible": props.isFlipped
                  }
                )}
              />
            )
          })
        }
        {
          !props.isFlipped && showNextPageButton && (
            <button onClick={props.isLastSheet ? cardContext.nextSection : cardContext.nextPage} className={cn(
              "underline underline-offset-2 cursor-pointer opacity-0 absolute bottom-9 right-4",
              {
                "[animation:fade-in_1s_ease-in_forwards]": showNextPageButton,
                "invisible": props.isFlipped,
              }
            )}>
              More {">>"}
            </button>
          )
        }
        {
          props.backPageAnimation && (
            <div className={cn(
              "overflow-hidden absolute left-0 right-0 top-0",
              "h-full w-full",
              {
                "[animation:fade-in_1s_ease-in_forwards]": props.isFlipped, // page flipped and show animation in back page
                // "[animation:fade-out_0.2s_ease-in_forwards]": props.isFlipped,
                "invisible": !props.isFlipped
              }
            )}>
              {
                props.backPageAnimation
              }
            </div>
          )
        }
      </div>
    </>
  )
}

type CardCoverProps = {
  children: React.ReactNode
  hideContent: boolean
  cardOpen: boolean
  handleOpenCard: () => void
  birthdayCardRef: React.RefObject<HTMLDivElement>
}

const CardCover = ({ children, ...props }: CardCoverProps) => {
  return (
    <>
      <div className={cn(
        "birthdayCard *:rounded-r-lg",
        {
          "[transform:perspective(2500px)_rotate(5deg)]": props.cardOpen,
          "[box-shadow:inset_100px_20px_100px_rgba(0,0,0,.2),_0_10px_100px_rgba(0,0,0,0.5)]": props.cardOpen
        }
      )}
        ref={props.birthdayCardRef}
      >
        <div className={cn(
          "cardFront",
          {
            "[transform:rotateY(-160deg)]": props.cardOpen,
            "z-10": props.hideContent

          }
        )}>
          <div className={cn(
            "happy",
            "mt-[30px] mx-[30px]",
            "text-sm p-2 rounded-lg font-semibold",
            {
              "[animation:fade-out_0.6s_ease-in_forwards]": props.cardOpen,
              "invisible": props.cardOpen
            }
          )}>
            <p className="font-playwrite">
              Happy Birthday
            </p>
            <p className="font-playwrite mt-4">{targetName}</p>
          </div>

          {/* front page: cat mail */}
          <div className={cn(
            "h-[80%] overflow-hidden absolute left-0 right-0 bottom-0",
            {
              "[animation:fade-out_0.2s_ease-in_forwards]": props.cardOpen,
            }
          )}>
            <DotLottieReact
              data={CatMail}
              loop
              autoplay
            />
          </div>

          {/* back page: cat balloon */}
          <div className={cn(
            "h-full overflow-hidden absolute left-0 right-0 top-0",
            {
              "invisible": !props.cardOpen,
              "[animation:fade-in_1s_ease-in_forwards]": props.cardOpen,
              "[animation:fade-out_0.2s_ease-in_forwards]": props.hideContent
            }
          )}>
            <DotLottieReact
              data={CatBalloon}
              loop
              autoplay
            />
          </div>
        </div>
        {
          !props.cardOpen && (
            <button onClick={props.handleOpenCard} className={cn(
              "bg-[#F7879A] pr-2 py-2",
              "absolute bottom-8 left-full flex items-center gap-1",
              "text-white text-xs rounded-r-lg",
              {
                "hidden": props.cardOpen
              }
            )}>
              <span>Open</span>
              <span><ImBookmark /></span>
            </button>
          )
        }
        {children}
        <div className={cn(
          "absolute bg-[#F7879A] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
          "shadow-[inset_100px_20px_100px_rgba(0,0,0,0.2)]",
          "font-playwrite text-sm",
          "-z-10"
        )}>
        </div>
      </div>
    </>
  )
}

export default function BirthdayCard() {
  const [cardOpen, setCardOpen] = useState(false)
  const birthDayCardRef = useRef<HTMLDivElement>(null)

  const appContext = useContext(AppContext)

  const [renderedSheets, setRenderedSheets] = useState<GreetingPage[]>(greetingPages.slice(0, 1))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!birthDayCardRef.current || birthDayCardRef.current.contains(event.target as Node)) return

      if (!cardOpen) return

      setCardOpen(false)
      setRenderedSheets(greetingPages.slice(0, 1))
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
    setRenderedSheets(greetingPages.slice(0, 1))
  }

  const handleNextGreetingCardPage = () => {
    const start = renderedSheets.length == 0 ? 0 : renderedSheets[renderedSheets.length - 1].sheetNumber - 1
    const pageCount = 2

    setRenderedSheets(greetingPages.slice(start, start + pageCount))
  }

  const handleNextSection = () => {
    appContext.setState(prev => ({
      ...prev,
      page: 4
    }))
  }

  return (
    <>
      <BaloonSpawner />
      <GreetingCardPageContext.Provider value={{
        rightSheet: renderedSheets.length === 0 ? 0 : renderedSheets[renderedSheets.length - 1].sheetNumber,
        nextSection: handleNextSection,
        nextPage: handleNextGreetingCardPage

      }}>
        <div className={cn(
          "bg-transparent h-screen",
          "flex items-center justify-center",
          "[animation:fade-in_2.3s_ease-in_forwards]"
        )}>
          <CardCover
            hideContent={renderedSheets.length > 0 && renderedSheets[renderedSheets.length - 1].sheetNumber >= 2}
            cardOpen={cardOpen}
            birthdayCardRef={birthDayCardRef}
            handleOpenCard={handleOpenCard}
          >
            {
              cardOpen && renderedSheets.map((greeting, i, arr) => {
                return (
                  <GreetingCardPage
                    key={greeting.sheetNumber}
                    paragraphs={greeting.paragraphs}
                    isLastSheet={greeting.sheetNumber === greetingPages.length}
                    isFlipped={i === 0 && arr.length > 1}
                    backPageAnimation={greeting.backPageAnimation}
                    sheetNumber={greeting.sheetNumber}
                  />
                )
              })
            }
          </CardCover>
        </div>
      </GreetingCardPageContext.Provider >
    </>
  )
}
