import { Suspense } from 'react'
import Subtest from './subtestClient'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Subtest />
    </Suspense>
  )
}
