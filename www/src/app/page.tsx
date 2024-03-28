import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { IoPlayOutline, IoPlay } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


async function getData() {
  const res = await fetch('http://127.0.0.1:8000/api/sample')

  return res.json()
}

export default async function Home(): Promise<JSX.Element> {
  
  const data = await getData()

  return (
    <>
      <div className="flex transition-all pt-16 sm:pl-64 w-full h-screen">
        <Table className=" flex flex-col overflow-scroll">
          <TableHeader className="flex flex-row w-full h-14">
            <TableRow className="flex flex-row w-full items-center shadow-md divide-x">
              <TableHead className="flex flex-col w-24 h-6 pl-3
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
                <TableCell className="flex flex-col w-24 overflow-clip shrink-0 p-0 pl-3">
                  <div className="flex flex-row justify-around py-2">
                    <Image 
                      className="flex rounded-full size-8 self-center"
                      src={sample.pack.cover}
                      width={32}
                      height={32}
                      alt=""
                    />
                    <Button className="group transition-all flex size-8 p-0 hover:ring-1 hover:bg-gray-200" variant="ghost">
                      <IoPlayOutline className="size-7 group-hover:hidden"/>
                      <IoPlay className="hidden size-7 group-hover:block"/>
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="flex flex-col basis-2/5 shrink-0 
                                      font-medium">
                                      {sample.name}
                </TableCell>
                <TableCell className="flex flex-col basis-16">0:00</TableCell>
                <TableCell className="flex flex-col basis-1/5">{sample.pack.name}</TableCell>
                <TableCell className="flex flex-col basis-1/5">{sample.category}</TableCell>
                
              </TableRow>
            )}
          </TableBody>
          
        </Table>
        
      </div>
    </>
    
  );
}
