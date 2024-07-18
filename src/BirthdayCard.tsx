import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { cn } from "./lib/utils"
import "./styles/birthday-card.css"
import { AppContext } from "./Context"
import TypedWriter from "./components/TypedWriter";
import BaloonSpawner from "./BalloonSpawner"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { PiBookOpenTextFill } from "react-icons/pi";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const targetName = import.meta.env.VITE_TARGET_NAME
const birthdayDate = import.meta.env.VITE_BIRTHDAY_DATE

type BirthdayDateToDisplay = {
  ordinalIndicator: string,
  date: string,
  month: string,
  year: string
}

function birthdayDateToDisplay(dateStr: string): BirthdayDateToDisplay {
  const d = new Date(dateStr)
  const date = d.getDate()
  let ordinalIndicator = "th"

  if (date === 1) {
    ordinalIndicator = "st"
  } else if (date === 2) {
    ordinalIndicator = "nd"
  } else if (date === 3) {
    ordinalIndicator = "rd"
  }

  return {
    ordinalIndicator: ordinalIndicator,
    date: date.toString(),
    month: months[d.getMonth()],
    year: d.getFullYear().toString()
  }
}

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
      `On this special day and beyond, I wish for you to always find joy in every moment. May all your dreams and goals come true, bringing you endless happiness.`
    ],
    backPageAnimation: (
      <DotLottieReact
        src="/cat-pencil.lottie"
        autoplay
        loop
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
        src="/cat-hero.lottie"
        autoplay
        loop
      />
    )
  },
  {
    sheetNumber: 3,
    paragraphs: [
      "Life is a rollercoaster, but you've got the strength to ride through the ups and downs. Keep smiling, keep shining, and know that brighter days are always ahead.",
      "You’re stronger than you think!"
    ],
    backPageAnimation: (
      <DotLottieReact
        src="/cat-rocket.lottie"
        autoplay
        loop
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
        src="/cat-squeeze.lottie"
        autoplay
        loop
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
    }, 800)
  }, [])

  return (
    <>
      <div className={cn(
        "absolute bg-[#F9A8D4] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
        "w-full h-full",
        "shadow-[inset_100px_20px_100px_rgba(90,90,90,0.2)]",
        "font-playwrite text-sm",
        "lg:text-base lg:px-5 lg:py-10",
        "z-10",
        "[transform-origin:left] [transition:.6s]",
        {
          "[box-shadow:inset_100px_20px_100px_rgba(30,30,30,.2)]": props.isFlipped,

          "[transform:rotateY(-160deg)]": props.isFlipped, // flip
          "hidden": cardContext.rightSheet >= (props.sheetNumber + 2)
        }
      )}>
        {
          !props.isFlipped && props.paragraphs.slice(0, currentParagraphIdx + 1).map((paragraph, i) => {
            return (
              <TypedWriter
                key={i}
                text={paragraph}
                delay={60}
                onFinish={i === props.paragraphs.length - 1 ? handleShowNextPageButton : handleShowNextParagraph}
                className={cn(
                  "text-left mb-6",
                  "font-playwrite leading-loose text-slate-900",
                  "lg:[line-height:2.25]",
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
              "underline underline-offset-2 cursor-pointer opacity-0 absolute bottom-9 right-4 text-slate-900",
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
          showNextPageButton && props.backPageAnimation && (
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
  const birthdayDateDisplay = birthdayDateToDisplay(birthdayDate)

  return (
    <>
      <div className={cn(
        "birthdayCard *:rounded-r-lg",
        "lg:w-[312.5px] lg:h-[437.5px]",
        {
          "[transform:perspective(2500px)_rotate(5deg)]": props.cardOpen,
          "[box-shadow:inset_100px_20px_100px_rgba(0,0,0,.2),_0_10px_100px_rgba(0,0,0,0.5)]": props.cardOpen
        }
      )}
        ref={props.birthdayCardRef}
      >
        <div className={cn(
          "cardFront",
          "w-full h-full",
          "lg:text-base",
          {
            "[transform:rotateY(-160deg)]": props.cardOpen,
            "z-10": props.hideContent

          }
        )}>
          <div className={cn(
            "happy",
            "mt-[30px] mx-[30px]",
            "px-2 pt-2 pb-2 rounded-lg font-semibold",
            "lg:px-3 lg:pt-3",
            {
              "[animation:fade-in_0.6s_ease-in_forwards]": !props.cardOpen,
              "[animation:fade-out_0.6s_ease-in_forwards]": props.cardOpen,
              "invisible": props.cardOpen
            }
          )}>
            <p className="font-playwrite text-slate-900 font-semibold">
              Happy Birthday
            </p>
            <p className="font-playwrite mt-4 font-semibold">{targetName}</p>
          </div>
          <div className={cn(
            "happy w-fit mx-auto",
            "px-2 pb-2 pt-1 rounded-b-lg font-semibold",
            "lg:px-3 lg:pb-3",
            {
              "[animation:fade-in_0.6s_ease-in_forwards]": !props.cardOpen,
              "[animation:fade-out_0.6s_ease-in_forwards]": props.cardOpen,
              "invisible": props.cardOpen
            }
          )}>
            <p className="font-playwrite text-slate-900 font-semibold">
              {`${birthdayDateDisplay.month} ${birthdayDateDisplay.date}`}
              <sup>{birthdayDateDisplay.ordinalIndicator}</sup>
              {`, ${birthdayDateDisplay.year}`}
            </p>
          </div>

          {/* front page: cat mail */}
          <div className={cn(
            "h-[62%] overflow-hidden absolute left-0 right-0 bottom-0",
            {
              "[animation:fade-in_0.6s_ease-in_forwards]": !props.cardOpen,
              "[animation:fade-out_0.2s_ease-in_forwards]": props.cardOpen,
            }
          )}>
            <DotLottieReact
              src="/cat-mail.lottie"
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
              src="/cat-balloon.lottie"
              loop
              autoplay
            />
          </div>
        </div>
        {
          !props.cardOpen && (
            <button onClick={props.handleOpenCard} className={cn(
              "bg-[#F9A8D4] pr-2 py-2",
              "absolute bottom-8 left-full flex items-center gap-1",
              "text-white text-xs rounded-r-lg",
              "lg:text-base",
              {
                "hidden": props.cardOpen
              }
            )}>
              <span>Open</span>
              <span><PiBookOpenTextFill /></span>
            </button>
          )
        }
        {children}
        <div className={cn(
          "absolute bg-[#F9A8D4] w-[250px] h-[350px] -z-10 left-0 top-0 px-4 py-9",
          "shadow-[inset_100px_20px_100px_rgba(0,0,0,0.2)]",
          "lg:w-[312.5px] lg:h-[437.5px]",
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
      <GreetingCardPageContext.Provider value={{
        rightSheet: renderedSheets.length === 0 ? 0 : renderedSheets[renderedSheets.length - 1].sheetNumber,
        nextSection: handleNextSection,
        nextPage: handleNextGreetingCardPage

      }}>
        <div className={cn(
          "bg-transparent h-screen",
          "bg-teal-100",
          "flex items-center justify-center rounded-r-lg",
          "[animation:fade-in_2.3s_ease-in_forwards]",
          "lg:text-xl"
        )}>
          <BaloonSpawner />
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
