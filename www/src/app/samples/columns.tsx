"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { IoPlayOutline, IoPlay } from "react-icons/io5";
import { Url } from "next/dist/shared/lib/router/router";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Pack = {
  id: number
  type: string
  name: string
  author: string
  cover: string
}

export type Sample = {
  id: number
  file: string
  name: string
  pack: Pack
  category_name: string
}

const columnHelper = createColumnHelper<Sample>()

export const columns: ColumnDef<Sample>[] = [
  // Display Column
  columnHelper.display({
    id: 'image',
    minSize: 1,
    size: 1, //uses custom TailwindCSS w-[value] format 1=10/2=auto
    header: () => <div className="font-bold">Pack</div>,
    cell: props => {
      const image= props.row.original.pack.cover

      return <Image
      alt="cover"
      className="flex rounded-full size-7 self-center ml-1"
      src={ image }
      width={32}
      height={32}
      />
    },
  }),
  {
    accessorKey: "file",
    header: "",
    minSize: 1,
    size: 1, //uses custom TailwindCSS w-[value] format 1=10/2=auto
    cell: ({row}) => {
      return <Button className="group transition-all flex size-8 p-1 hover:ring-1 hover:bg-gray-200 mr-2" variant="ghost">
        <IoPlayOutline className="size-7 group-hover:hidden"/>
        <IoPlay className="hidden size-7 group-hover:block"/>
      </Button>
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    minSize: 1,
    size: 2, //uses custom TailwindCSS w-[value] format 1=10/2=auto

  },
  {
    accessorKey: "category_name",
    header: "Category",
    minSize: 1,
    size: 2, //uses custom TailwindCSS w-[value] format 1=10/2=auto
  },
]
