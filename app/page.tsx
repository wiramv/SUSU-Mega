

import thumbnail from "../public/thumb.jpeg"
import Image from "next/image"

// component
import TablesWrapper from "@/app/Components/TablesWrapper";
//type
type state = "table" | "input"

export default function Home(){
  return (
      <div className="grid grid-cols-12 h-screen">
        {/*Thumbnail*/}
        <div id="thumb" className="col-span-3 h-full bg-pink-50">
          <Image src={thumbnail} alt={"thumbnail"} className={'h-screen object-cover'} loading={'lazy'}/>
        </div>
      {/*  Main*/}
        <div className={'col-span-9'}>
            <TablesWrapper/>
        </div>
      </div>
  )
}