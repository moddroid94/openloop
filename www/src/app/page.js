import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Image from 'next/image'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"


async function getData() {
  const res = await fetch('http://127.0.0.1:8000/api/sample')

  return res.json()
}

export default async function Home() {
  
  const data = await getData()

  return (
    <>
      <div className="flex transition-all pt-16 sm:pl-64 w-full h-screen">
        <Table className=" flex flex-col overflow-scroll">
          <TableHeader className="flex flex-row w-full h-14">
            <TableRow className="flex flex-row w-full items-center shadow-md divide-x">
              <TableHead className="flex flex-col w-14 h-6 pl-3
                                    font-bold">
                                    Pack
              </TableHead>
              <TableHead className="flex flex-col basis-2/5 shrink-0 h-6 
                                    font-bold">
                                    Name
              </TableHead>
              <TableHead className="flex flex-col w-16 h-6">Time</TableHead>
              <TableHead className="flex flex-col basis-1/5 h-6">Pack</TableHead>
              <TableHead className="flex flex-col basis-1/5 h-6">Category</TableHead>
              
            </TableRow>
          </TableHeader>
          <TableBody className="flex flex-col w-full">
            {data.map((sample) => 
              <TableRow key={sample.id} className="flex flex-row w-full items-center ">
                <TableCell className="flex flex-col w-14 overflow-clip shrink-0 p-0 pl-3">
                  <Image 
                    className="rounded-full"
                    src={sample.pack.cover}
                    width={32}
                    height={32}
                  />
                </TableCell>
                <TableCell className="flex flex-col basis-2/5 shrink-0 
                                      font-medium">
                                      {sample.name}
                </TableCell>
                <TableCell className="flex flex-col basis-16">0:00</TableCell>
                <TableCell className="flex flex-col basis-1/5">{sample.pack.name}</TableCell>
                <TableCell className="flex flex-col basis-1/5">{sample.category_name}</TableCell>
                
              </TableRow>
            )}
          </TableBody>
          
        </Table>
        
      </div>
    </>
    
  );
}
