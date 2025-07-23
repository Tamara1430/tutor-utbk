import { Suspense } from 'react'
import User from './User'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <User />
    </Suspense>
  )
}
