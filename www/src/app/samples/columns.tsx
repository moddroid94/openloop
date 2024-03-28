"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { IoPlayOutline, IoPlay, IoAddOutline } from "react-icons/io5";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Pack = {
  id: number
  type: string
  name: string
  author: string
  cover: string
  tags: Array<string>
}

export type Sample = {
  id: number
  file: string
  name: string
  pack: Pack
  category: string
  duration: number
  tags: Array<string>
}

const columnHelper = createColumnHelper<Sample>()

export function getTags(row) {
  var tags = row.getValue("tags").toString()
  var tagsfield = tags.split(",").map(function(item) {
    return item.trim();
  });
  return tagsfield
}
export const columns: ColumnDef<Sample>[] = [
  // Display Column
  columnHelper.display({
    id: 'image',
    header: "",
    cell: props => {
      const image= props.row.original.pack.cover

      return (
        <button className="transition relative group flex py-0 px-0 rounded-full size-8 overflow-clip hover:shadow-sm hover:ring-1 hover:ring-black">
          <IoAddOutline className="absolute top-0 z-10 transition rounded-full scale-0 size-8 group-hover:scale-100 text-black bg-slate-50" />
          <Image
           className="absolute top-0 z-0 rounded-full transition size-8 group-hover:scale-70"
            alt="cover"
            src={ image }
            width={32}
            height={32}
          />
        </button>
      )
    },
  }),
  {
    accessorKey: "file",
    header: "",
    cell: ({row}) => {
      return <button className="relative group transition flex size-7 rounded-full p-1 hover:ring-1 hover:ring-black">
        <IoPlayOutline className="transition absolute top-0 left-0 m-1 translate-x-[1px] size-5 scale-90 group-hover:opacity-0"/>
        <IoPlay className="transition absolute top-0 left-0 m-1 translate-x-[1px] scale-0 size-5 group-hover:scale-100"/>
      </button>
    }
  },
  {
    accessorKey: "name",
    header: () => <div className="flex font-bold my-auto">Name</div>,
    cell: ({ row }) => <div className="flex font-bold">{row.getValue("name")}</div>
  },
  {
    accessorKey: "tags",
    header: () => <div className="flex font-bold my-auto">Tags</div>,
    cell: ({ row }) => row.getValue("tags").toString().split(",").map(function(item) {
      if (item) {
        item = "#" + item
        return (
          <div key={item} className="inline-flex items-center rounded-md bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{item}</div>
        )
      } else {
        return
      }
      
    })
  },
  {
    accessorKey: "duration",
    header: () => <div className="flex font-bold my-auto">Time</div>,
    cell: ({row}) => {
      const time = parseInt(row.getValue("duration"))
      if (time) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        const ftime = minutes + ":" + seconds.toString().padStart(2, "0")
        return ftime
      }
      else {
        return
      }
    }
  },
  {
    accessorKey: "category",
    header: () => <div className="flex font-bold my-auto">Category</div>,
  },
  {
    accessorKey: "pack",
    header: () => <div className="flex font-bold my-auto">Pack</div>,
    cell: ({row}) => row.getValue("pack")["name"]
  },
  columnHelper.display({
    id: 'actions',
    header: "",
    cell: props => {
      const data = props.row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="justify-self-end h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(data.file.toString())}
            >
              Copy url
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Download Sample</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }),
]
