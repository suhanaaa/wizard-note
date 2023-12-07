import Image from 'next/image'
import logo from '../assets/logo.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Home() {

  const { userId } = auth();

  if (userId) redirect("/notes");



  return (
    <main className='flex flex-col h-screen items-center justify-center gap-5'>
      <div className='flex items-center gap-4'>
          <Image src={logo} alt="Wizard Notes" width={100} height={100} />
          <span className='font-extrabold tracking-tighter text-4xl  lg:text-5xl'>Wizard Notes</span>
      </div>

      <p className='max-w-prose text-center'>
        An intelligent note taking app with a focus on productivity that's easy to use. It can help you with many different tasks powered by AI and OpenAI.
      </p>

      <Button size='lg' asChild > 
        <Link href="/notes">Open</Link>
      </Button>

    </main>
  )
}
