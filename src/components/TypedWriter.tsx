import { useEffect, useState } from "react"

type TypedProps = {
  text: string
  delay: number
  callback?: () => void
  className?: string
}

export default function TypedWriter(props: TypedProps) {
  const [currentChars, setCurrentChars] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= props.text.length) {
      if (props.callback) {
        props.callback()
      }
      return
    }

    const timeout = setTimeout(() => {
      setCurrentChars(currentChars + props.text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, props.delay)

    return () => clearTimeout(timeout)
  }, [currentChars, props, currentIndex])

  return <p className={props.className}>{currentChars}</p>
}
