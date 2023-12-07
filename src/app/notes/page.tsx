import Note from "@/components/ui/Note";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next"


export const metadata: Metadata = {
    title: 'Wizard Notes - Notes',
}


const NotesPage = async () => {

  const { userId } = auth();

  if(!userId) throw Error("userId Undefined");

  const allNotes = await prisma.note.findMany({
    where: {
      userId
    }
  })




  return (
    <div className="grid gap-3  sm:grid-cols-2 md:grid-cols-3">
      {allNotes.map((note) => (
        <Note key={note.id} note={note} />
      ))}

      {allNotes.length === 0 && (
        <div className="col-span-full  flex h-[80vh] items-center justify-center">
          {"You don't have any notes yet. Please create one."}
        </div>
      )}
    </div>
  )
}

export default NotesPage