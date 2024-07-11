import { useEffect, useState } from "react"

type TypedProps = {
  text: string
  delay: number
  callback?: () => void
  onFinish?: () => void
  className?: string
}

export default function TypedWriter(props: TypedProps) {
  const [currentChars, setCurrentChars] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // console.log("props.text", props.text)

  useEffect(() => {
    if (currentIndex >= props.text.length) {
      if (props.callback) {
        props.callback()
      }
      if (props.onFinish) {
        props.onFinish()
      }
      return
    }

    const timeout = setTimeout(() => {
      setCurrentChars(currentChars + props.text[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, props.delay)

    return () => clearTimeout(timeout)
  }, [currentChars, currentIndex, props.onFinish, props.callback])

  return <p className={props.className}>{currentChars}</p>
}
