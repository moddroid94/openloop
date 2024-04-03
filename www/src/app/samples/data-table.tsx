"use client"

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { IoChevronDown } from "react-icons/io5"


export function DataTable({
  columns,
  initialData,
  paginate,
}) {
  const searchParams = useSearchParams()
  const [data, setData] = useState(initialData)
  const router = useRouter()
  const pathname = usePathname()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: paginate.count,
    autoResetPageIndex: false,
  })

  const [state, setState] = useState(table.initialState)
  const [sorting, setSorting] = useState('name')

  // Override the state managers
  table.setOptions(prev => ({
    ...prev,
    state,
    onStateChange: setState,
  }))

  function getCellClass(id: string, isheader: boolean) {
    /**
     * get extra style classes dinamically
     * id: name of the header
     */
    if (isheader == true) {
      switch (id){
        case 'image':
          return 'basis-12 shrink-0 grow-0 pointer-events-none'
        case 'file':
          return 'basis-12 shrink-0 grow-0 pointer-events-none'
        case 'name':
          return 'w-48 grow shrink-0 truncate pointer-events-auto'
        case 'tags':
          return 'flex-row gap-2 w-24 grow shrink-0 pointer-events-auto'
        case 'duration':
          return 'basis-14 shrink-0 pointer-events-auto'
        case 'category':
          return 'w-36 shrink truncate transition hidden sm:flex pointer-events-auto'
        case 'pack':
          return 'w-48 shrink truncate transition hidden sm:flex pointer-events-auto'
        case 'actions':
          return 'basis-12 items-end pointer-events-none'
      }
    } else {
      switch (id){
        case 'image':
          return 'basis-12 shrink-0 grow-0'
        case 'file':
          return 'basis-12 shrink-0 grow-0'
        case 'name':
          return 'w-48 grow shrink-0 truncate'
        case 'tags':
          return 'flex-row gap-2 w-24 grow shrink-0'
        case 'duration':
          return 'basis-14 shrink-0'
        case 'category':
          return 'w-36 shrink truncate transition hidden sm:flex'
        case 'pack':
          return 'w-48 shrink truncate transition hidden sm:flex'
        case 'actions':
          return 'basis-12 items-end'
      }
    }
    
    }
  
  function changePage(index = 0) {
    const page = fetch('/samples/api?page=' + index)
    .then((res) => res.json())
    .then((data) => {
      state.pagination.pageIndex = index - 1 // offset index becuase table starts index at 0 but api at 1
      setData(data.results)
      var myDiv = document.getElementById('scrollarea');
      myDiv.scroll({ top: 0, behavior: 'smooth' });
      
    })
  }

  function OrderBy(id: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('ordering', id)) {
      id = "-" + id
      
    }
    params.set('ordering', id)
    setSorting(id)
    const page = fetch('/samples/api?' + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setData(data.results)
        var myDiv = document.getElementById('scrollarea');
        myDiv.scroll({ top: 0, behavior: 'smooth' });
      })
    return params.toString()
  }

  function getHeaderIconClass(id: string) {
    if (sorting.includes(id,1)) { //we only need to invert the icon so this only works if there is '-' before the ordering id and the id matches
      return "rotate-180"
    } else if (sorting == id) {
      return "inline-block"
    } else {
      return "hidden"
    }
  }

  return (
  <div className="flex relative w-full h-full">
    <Table className="flex">
      <TableHeader className="transition-all flex fixed right-0 top-16 z-10 rounded-md w-full sm:w-4/5 p-2 ">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="transition-all flex flex-row items-mide justify-start w-full border bg-slate-500 hover:bg-slate-500 border-black rounded-md shadow-lg overflow-clip pointer-events-none" key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead className={ "transition flex flex-col self-center px-2 text-white hover:bg-slate-600 hover:shadow-md rounded-md cursor-pointer " + getCellClass(header.id, true) } 
                  key={header.id} 
                  onClick={() => {router.push(pathname + '?' + OrderBy(header.id))}}>
                  <div className="flex my-auto flex-row">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  <IoChevronDown className={"size-4 self-end ml-1 mb-[1px] " + getHeaderIconClass(header.id)}/>
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody id="scrollarea" className="flex flex-col z-0 w-full h-screen pt-16 overflow-auto px-2">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              tabIndex={0}
              className="flex flex-row h-11 items-center"
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className={ "p-2 flex flex-col " + getCellClass(cell.column.id, false) }>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    <div className="absolute bottom-0 right-0 items-center justify-start space-x-2 py-4 pr-10">
    <Button
      variant="outline"
      size="sm"
      onClick={() => changePage((table.initialState.pagination.pageIndex + 1) - 1)}
      disabled={!table.getCanPreviousPage()}
    >
      Previous
    </Button>
    <Button
      variant="outline"
      size="sm"
      onClick={() => changePage((table.initialState.pagination.pageIndex + 1) + 1)}
      disabled={!table.getCanNextPage()}
    >
      Next
    </Button>
    </div>
  </div>
  )
}
