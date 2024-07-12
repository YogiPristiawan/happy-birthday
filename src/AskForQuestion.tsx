import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./Context";
import { cn } from "./lib/utils"

export default function AskForQuestion() {
  const appContext = useContext(AppContext)
  const targetName = import.meta.env.VITE_TARGET_NAME as string
  const [showMediaVolumeConfirmation, setShowMediaVolumeConfirmation] = useState<{ showText: boolean, showButton: boolean }>({ showText: false, showButton: false })

  const button = useRef<HTMLButtonElement>(null)
  const buttonPositionRef = useRef({ left: 0, top: 0 })

  useEffect(() => {
    if (button.current) {
      buttonPositionRef.current = {
        left: Number(button.current.style.left),
        top: Number(button.current.style.top)
      }
    }
  }, [])

  useEffect(() => {
    if (showMediaVolumeConfirmation.showText && !showMediaVolumeConfirmation.showButton) {
      const timeoutId = setTimeout(() => {
        setShowMediaVolumeConfirmation(prev => ({
          ...prev,
          showButton: true
        }))
      }, 5000)

      return () => clearTimeout(timeoutId)
    }
  }, [showMediaVolumeConfirmation])

  const handleOpenGift = () => {
    appContext.setState(prev => ({
      ...prev,
      page: 2
    }))
  }

  const handleWant = () => {
    setShowMediaVolumeConfirmation(prev => ({
      ...prev,
      showText: true
    }))
  }

  const handleOnMouseOver = () => {
    if (!button.current) return

    const viewportWidth = window.innerWidth - (window.innerWidth * 30 / 100); // i don't want to be too broad, so i substracted it
    const viewportHeight = window.innerHeight - (window.innerHeight * 30 / 100); // i don't want to be too broad, so i substracted it
    const buttonRect = button.current.getBoundingClientRect();

    // Calculate new position for the button
    let newLeft = Math.random() * (viewportWidth - buttonRect.width);
    let newTop = Math.random() * (viewportHeight - buttonRect.height);

    // Ensure the new position does not overlap with the current position
    if (Math.abs(newLeft - buttonRect.left) < buttonRect.width && Math.abs(newTop - buttonRect.top) < buttonRect.height) {
      newLeft = Math.random() * (viewportWidth - buttonRect.width);
      newTop = Math.random() * (viewportHeight - buttonRect.height);
    }

    button.current.classList.add("absolute")
    button.current.style.left = `${newLeft}px`;
    button.current.style.top = `${newTop}px`;
    button.current.innerText = "Eitss, ga kena 😋"
  }

  return (
    <>
      <div className={cn(
        "w-full border p-4 relative rounded-lg text-center justify-center",
        "md:max-w-[50%]"
      )}>
        {
          !showMediaVolumeConfirmation.showText ? (
            <>
              {
                appContext.state.correctTargetName ?
                  <p className="my-2">Haiii {targetName}, Sebenernya iseng aja nanya nama. Aku udah tau siapa kamu 😋</p>
                  :
                  <>
                    <p className="my-2">Ishh hamu bohong yaa? 😤</p>
                    <p className="my-2">Kamu {targetName} kan? 😒</p>
                  </>
              }
              <p className="my-2">Yuk main tebak-tebakan. Nanti aku kasih hadiah. Mau ga?</p>

              <div className="flex gap-4">
                <button className="bg-green-500 hover:bg-green-500/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4 animate-bounce" onClick={handleWant}>
                  <span>👌 Mau</span>
                </button>
                <button
                  ref={button}
                  className={cn(
                    "[transition:.3s] z-10",
                    "bg-red-500 hover:bg-red-500/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4",
                  )}
                  onMouseOver={handleOnMouseOver}
                  onTouchStart={handleOnMouseOver}
                  onClick={handleOnMouseOver}
                >
                  <span>🙏 Ga dulu</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="my-2">Tapi, sebelum lanjut gedein dulu volume nyaa</p>
              <p className="my-2">Kalau udah, klik OK yaa...</p>
              {
                showMediaVolumeConfirmation.showButton && (
                  <>
                    <button className="bg-green-500 hover:bg-green-500/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4" onClick={handleOpenGift}>👌 OK!</button>
                  </>
                )
              }
            </>
          )
        }
      </div>
    </>
  )
}
