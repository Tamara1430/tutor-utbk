import { Suspense } from 'react'
import BedahSoal from './bedahSoal'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BedahSoal />
    </Suspense>
  )
}
