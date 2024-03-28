import {  type NextRequest } from 'next/server'

// exactly mimics search params as they would be the same in teh backend
export async function GET(request: NextRequest): Promise<Response> {
  const res = await fetch('http://127.0.0.1:8000/api/sample?' + request.nextUrl.searchParams.toString())
  const data = await res.json()
 
  return Response.json(data)
}