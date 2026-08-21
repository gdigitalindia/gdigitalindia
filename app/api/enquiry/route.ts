import { POST as contactPOST } from '@/app/api/contact/route'

export async function POST(request: Request) {
  return contactPOST(request)
}
