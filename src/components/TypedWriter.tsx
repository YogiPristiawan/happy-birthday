import { useEffect, useState } from "react"

type TypedProps = {
  text: string
  delay: number
  callback?: () => void
  onFinish?: () => void
  className?: string
}

export default function TypedWriter({ onFinish, callback, text, delay, ...props }: TypedProps) {
  const [currentChars, setCurrentChars] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= text.length) {
      if (callback) {
        callback()
      }
      if (onFinish) {
        onFinish()
      }
      return
    }

    const timeout = setTimeout(() => {
      setCurrentChars(currentChars + text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, delay)

    return () => clearTimeout(timeout)
  }, [currentChars, currentIndex, onFinish, callback, text, delay])

  return <p className={props.className}>{currentChars}</p>
}
