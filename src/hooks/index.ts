import { useEffect, useMemo, useState } from "react"

type AudioPlayerArgs = {
  src: string
  loop: boolean
}

export default function useAudioPlayer(args: AudioPlayerArgs) {
  const audio = useMemo(() => {
    return new Audio(args.src)
  }, [args.src])

  if (args.loop) {
    audio.loop = true
  }

  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    setPlaying(prev => !prev)
  }

  useEffect(() => {
    if (playing) {
      audio.play()
      return
    }

    audio.pause()
  }, [playing, audio])

  return {
    togglePlay
  }
}
