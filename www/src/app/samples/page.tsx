import { Sample, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData() {
    const res = await fetch('http://127.0.0.1:8000/api/sample')

    return res.json()
}

export default async function Samples() {
  const data = await getData()

  return (
    <div className="flex transition pt-16 overflow-hidden w-full h-screen">
      <DataTable columns={columns} initialData={data.results} paginate={data} />
    </div>
  )
}
