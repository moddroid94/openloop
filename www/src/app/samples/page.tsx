import { Sample, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Sample[]> {
    const res = await fetch('http://127.0.0.1:8000/api/sample')

    return res.json()
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="flex transition-all pt-16 sm:pl-64 w-full h-screen">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
