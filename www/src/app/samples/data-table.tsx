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
import { ApiPage } from "./page"
import {Sample, columns} from "./columns"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { IoChevronDown, IoPlay, IoPlayOutline } from "react-icons/io5"

export type Props = {
  columns: typeof columns;
  paginate: any;

  playSong: (id: number) => void;
  onDataUpdate: (data: ApiPage) => void;
}

export function DataTable({
  columns,
  paginate,
  playSong,
  onDataUpdate,
}:Props) {
  
  const searchParams = useSearchParams()
  const [data, setData] = useState(Array<Sample>)
  const router = useRouter()
  const pathname = usePathname()

  const table = useReactTable<Sample>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    //rowCount: paginate.count,
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
    var classname = ''
    // add dimension and flex properties to all cols
    switch (id){
      case 'image':
        classname = 'basis-12 shrink-0 grow-0'
        break;
      case 'file':
        classname = 'basis-12 shrink-0 grow-0'
        break;
      case 'name':
        classname = 'w-48 grow shrink-0 truncate'
        break;
      case 'tags':
        classname = 'flex-row gap-2 w-24 grow'
        break;
      case 'duration':
        classname = 'basis-[70px] shrink-0'
        break;
      case 'category':
        classname = 'w-36 shrink truncate transition hidden sm:flex'
        break;
      case 'pack':
        classname = 'w-48 shrink truncate transition hidden sm:flex grow'
        break;
      case 'actions':
        classname = 'basis-12 items-end'
        break;
    }

    // add header specific rules for pointer events 
    if (isheader == true) {
      switch (id){
        case 'image':
          classname = classname + ' pointer-events-none'
          break;
        case 'file':
          classname = classname + ' pointer-events-none'
          break;
        case 'name':
          classname = classname + ' pointer-events-auto'
          break;
        case 'tags':
          classname = classname + ' pointer-events-auto'
          break;
        case 'duration':
          classname = classname + ' pointer-events-auto'
          break;
        case 'category':
          classname = classname + ' pointer-events-auto'
          break;
        case 'pack':
          classname = classname + ' pointer-events-auto'
          break;
        case 'actions':
          classname = classname + ' pointer-events-none'
        break;
      }
    }

    return classname
  }
  
  function changePage(index = 0) {
    const page = fetch('/samples/api?page=' + index)
    .then((res) => res.json())
    .then((data) => {
      state.pagination.pageIndex = index - 1 // offset index becuase table starts index at 0 but api at 1
      setData(data.results)
      onDataUpdate(data)
      var myDiv = document.getElementById('scrollarea');
      myDiv.scroll({ top: 0, behavior: 'smooth' });
      
    })
  }

  function getOrderingParams(order: string) {
    /**
     * get URLSearchParams of the ordering requested
     * add '-' to reverse order if param is already present
     * keeps other params, if present
     * @param order ordering requested as string
     * @returns string with params without the leading '?'
     */
    const params = new URLSearchParams(searchParams.toString())
    if (params.has('ordering', order)) {
      order = "-" + order
      
    }
    params.set('ordering', order)
    return params.toString()
  }

  function getNewSamplesQuery(params: URLSearchParams) {
    // fetch samples and updates data state
    // TODO Handle errors in request
    const page = fetch('/samples/api?' + params.toString())
      .then((res) => res.json())
      .then((data) => {
        setData(data.results)
        onDataUpdate(data)
        // scroll table to top
        var myDiv = document.getElementById('scrollarea');
        myDiv.scroll({ top: 0, behavior: 'smooth' });
      })
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
  
  function clickPlay(id: string) {
    playSong(parseInt(id))
  }

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    getNewSamplesQuery(params)
    if (params.has('ordering')) {
      setSorting(params.get('ordering'))
    }
  }, [searchParams])
  
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
                  onClick={() => {router.push(pathname + '?' + getOrderingParams(header.id))}}>
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
                  { cell.column.id == 'file' 
                  ? (
                    <button className="relative group transition flex size-7 rounded-full p-1 hover:ring-1 hover:ring-black" onClick={() => clickPlay(row.id)}>
                      <IoPlayOutline className="transition absolute top-0 left-0 m-1 translate-x-[1px] size-5 scale-90 group-hover:opacity-0"/>
                      <IoPlay className="transition absolute top-0 left-0 m-1 translate-x-[1px] scale-0 size-5 group-hover:scale-100"/>
                    </button>
                    )
                  : flexRender(cell.column.columnDef.cell, cell.getContext())
                  }
                  
                  
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
    <div className="transition absolute bottom-0 right-0 items-center justify-start space-x-2 py-4 pr-10">
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
