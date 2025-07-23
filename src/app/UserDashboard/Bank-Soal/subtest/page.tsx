import { Suspense } from 'react'
import BankClient from './BankClient'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BankClient />
    </Suspense>
  )
}
