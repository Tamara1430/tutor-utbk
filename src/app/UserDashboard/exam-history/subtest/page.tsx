import { Suspense } from 'react'
import ClientBankSoal from './ClientBankSoal'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientBankSoal />
    </Suspense>
  )
}
