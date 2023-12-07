"use client"
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/logo.png'
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import AddEditNoteDialog from "@/components/ui/AddEditNoteDialog"
import ThemeToggleButton from "@/components/ui/ThemeToggleButton"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"
import AIChatButton from "@/components/AIChatButton"



const Navbar = () => {

    const { theme } = useTheme();

    const [ showAddEditNoteDialog, setShowAddEditNoteDialog ] = useState(false)

  return (
    <>
    
    <div className="p-4 shadow">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center justify-between "> 
            <Link href="/notes" className="flex items-center gap-1">
                <Image src={logo} alt="Wizard Notes" width={40} height={40} />
                <span className="font-bold">Wizard Notes</span>
            </Link>


            

            <div className="flex items-center gap-2">
                <UserButton 
                afterSignOutUrl="/"
                appearance={{
                    baseTheme: theme === "dark" ? dark : undefined,
                    elements: {
                        avatarBox: {
                            width: "2.5rem",
                            height: "2.5rem"
                        }
                    }
                }}
                
                />

                <ThemeToggleButton />

                <Button onClick={() => setShowAddEditNoteDialog(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Note
                </Button>
                <AIChatButton />
            </div>
            
        </div>
    </div>
    <AddEditNoteDialog open={showAddEditNoteDialog} setOpen={setShowAddEditNoteDialog} />
    </>
  ) 
}

export default Navbar