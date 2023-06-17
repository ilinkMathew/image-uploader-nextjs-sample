import Image from 'next/image'
import { Inter } from 'next/font/google'
import {Uploader} from '@/components/uploader'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between lg:p-24  sm:m-2 ${inter.className}`}>
        <div className ={`container lg:w-1/4  sm:w-full text-center bg-white drop-shadow-md rounded-lg`}>
  <Uploader/>
  </div>
    </main>
  )
}
