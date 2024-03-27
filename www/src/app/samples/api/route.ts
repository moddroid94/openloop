import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('page')
  const res = await fetch('http://127.0.0.1:8000/api/sample?page=' + query)
  const data = await res.json()
 
  return Response.json(data)
}