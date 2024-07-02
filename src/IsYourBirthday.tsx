import { useContext } from "react";
import { AppContext } from "./Context";
import { cn } from "./lib/utils"
import { FaGift } from "react-icons/fa6";

export default function IsYourBirthday() {
  const appContext = useContext(AppContext)
  const targetName = import.meta.env.VITE_TARGET_NAME as string

  const handleOpenGift = () => {
    appContext.setState(prev => ({
      ...prev,
      page: 3
    }))
    appContext.state.toggleAudioPlay()
  }

  return (
    <>
      <div className={cn(
        "w-full border p-4 relative rounded-lg text-center justify-center",
        "md:max-w-[50%]"
      )}>
        {
          appContext.state.correctTargetName ?
            <p>Haiii {targetName}, Sebenernya iseng aja nanya nama. Aku udah tau siapa kamu 😋</p>
            :
            <>
              <p>Ishh hamu bohong yaa? 😤</p>
              <p>Kamu {targetName} kan? 😒</p>
            </>
        }
        <p>Aku punya sesuatu buat kamu, buka yaa...</p>

        {/* <div className="w-full overflow-visible"> */}
        {/*   <Lottie */}
        {/*     animationData={GiftBox} */}
        {/*     height={100} */}
        {/*     width={100} */}
        {/*   // className="bg-red-300" */}
        {/*   /> */}
        {/* </div> */}

        <button className="bg-pink-400 hover:bg-pink-400/75 flex items-center p-2 gap-2 text-white rounded-lg mx-auto mt-4 animate-bounce" onClick={handleOpenGift}>
          <FaGift />
          <span>Buka</span>
        </button>
      </div>
    </>
  )
}
