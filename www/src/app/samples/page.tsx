'use client'

import { Player } from "@/components/player"
import { Sample, columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, useMemo, useState } from "react"

export type ApiPage = {
  count: number;
  next;
  previuos;
  results: Array<Sample>;
}

export type AudioFile = {
  title: string;
  url: string;
  author: string;
  thumbnail: string;
}

export default function Samples() {
  const [data, setData] = useState<ApiPage>()
  const [audio, setAudio] = useState<AudioFile>()

  function getData() {
    const page = fetch('http://127.0.0.1:3000/samples/api')
    .then((res) => res.json())
    .then((data) => {setData(data)})
  }

  const playSong = (id:string) => {
    console.log(data.results[id].file)
    const file = data.results[id]
    const audiofile: AudioFile = {
      title: file.name,
      url: file.file,
      author: file.pack.name,
      thumbnail: file.pack.cover
    }
    setAudio(audiofile)
  }

  const updateData = (data) => {
    console.log(data)
    setData(data)
  }

  useEffect(() => {
    getData()
  },[])
  
  return (
    <>
    <div className={"flex transition pt-16 overflow-hidden w-full h-screen " + (audio ? "pb-36" : "")}>
      <DataTable 
        columns={columns}
        paginate={data}
        playSong={playSong}
        onDataUpdate={updateData}
      />
    </div>
    <div className={"transition fixed bottom-0 sm:w-4/5 w-full p-2 " + (audio ? "" : "translate-y-48")}>
      <Player
        title={audio?.title}
        url={audio ? audio.url : "und"}
        author={audio?.author}
        thumbnail={audio?.thumbnail}
      />
    </div>
    </>
    
  )
}
