import { memo } from "react";
import { cn } from "./lib/utils"
import "./styles/baloon.css"

function random(num: number) {
  return Math.floor(Math.random() * num);
}

function createBaloons(count: number) {
  const baloons = []

  for (let i = count; i > 0; i--) {
    baloons.push(<Balloon key={i} />)
  }

  return baloons
}

function Balloon() {
  // const styleText = getRandomStyles()
  const r = random(255);
  const g = random(255);
  const b = random(255);
  const mt = random(200);
  const ml = random(50);
  const dur = random(5) + 5;


  return (
    <div className={cn(
      // "h-[125px] w-[105px] [border-radius:75%_75%_70%_70%] relative",
      // "before:content-[''] before:h-[75px] before:[w-1px] before:bg-[#FDFD96] before:block before:absolute before:top-[125px] before:left-0 before:right-0 before:m-auto",
      // "after:content-['▲'] after:text-center after:block after:absolute after:text-inherit after:top-120px after:left-0 after:right-0 after:m-auto",
      "balloon",

      "mr-0 mb-0",
      `[animation:float_1s_ease-in_infinite]`
    )}
      style={{
        background: `rgba(${r},${g},${b},0.7)`,
        color: `rgba(${r},${g},${b},0.7)`,
        boxShadow: `inset -7px -3px -10px rgba(${r - 10},${g - 10},${b - 10},0.7)`,
        marginTop: `${mt}px`,
        marginLeft: `${ml}px`,

        animationName: "float",
        animationDuration: `${dur}s`,
        animationTimingFunction: "ease-in",
        animationIterationCount: "infinite"
      }}
    >
    </div>
  )
}

export default memo(function BalloonSpawner() {
  return (
    <div className={cn(
      "h-[100vh] p-[1em] box-border flex flex-wrap overflow-hidden [transition:opacity_500ms]",
      "fixed top-0 bottom-0 right-0 left-0 -z-10"
    )}>
      {
        createBaloons(24)
      }
    </div>
  )
}
)
