'use client'

import { Player, AudioFile } from "@/components/player"
import { Sample, columns } from "./columns"
import { DataTable } from "./data-table"
import { useEffect, Suspense, useState } from "react"

export type ApiPage = {
  count: number;
  next;
  previuos;
  results: Array<Sample>;
}


export default function Samples() {
  const [data, setData] = useState<ApiPage>()
  const [audio, setAudio] = useState<AudioFile>()

  function getData() {
    const page = fetch('/samples/api')
    .then((res) => res.json())
    .then((data) => {setData(data)})
  }

  const playSong = (id:number) => {
    const file = data.results[id]
    //We need to rebuild the urls because the ones from the api uses web:8000 as domain, which don't work as the request is made from the frontend
    //there's surely a better way of doing this, maybe from the storage model in django or the api, idk
    //this is bad, i know.
    const urlfix = "http://192.168.1.102:1337/media/uploads/" + file.pack.name + "/Sounds/" + file.category + "/" + file.file.split('/').pop()
    const coverfix = "http://192.168.1.102:1337/media/uploads/" + file.pack.name + "/Artworks/" + file.pack.cover.split('/').pop()
    const audiofile: AudioFile = {
      id: id,
      title: file.name,
      url: urlfix,
      author: file.pack.name,
      thumbnail: coverfix,
    }
    setAudio(audiofile)
  }

  const updateData = (data: ApiPage) => {
    setData(data)
  }

  const skipForward = () => {
    if (audio.id + 1 < data.results.length) {
      playSong(audio.id + 1)
    } else {
      console.log('end of array')
    }
  }
  const skipBackward = () => {
    if (audio.id > 0) {
      playSong(audio.id - 1)
    } else {
      console.log('start of array')
    }
  }

  useEffect(() => {
    getData()
  },[])
  
  return (
    <>
    <div className={"flex transition pt-16 overflow-hidden w-full h-screen " + (audio ? "pb-48" : "")}>
      <Suspense>
        <DataTable 
          columns={columns}
          paginate={data}
          playSong={playSong}
          onDataUpdate={updateData}
        />
      </Suspense>
    </div>
    <div className={"transition fixed bottom-0 sm:w-4/5 w-full p-2 " + (audio ? "" : "translate-y-48")}>
      {audio 
        ? (
          <Player
            audio={audio}
            onFwd={skipForward}
            onBwd={skipBackward}
          />
          )
        : <></>
      }
    </div>
    </>
    
  )
}
