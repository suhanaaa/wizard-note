"use client"
import { Note as NoteModel } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { useState } from "react";
import AddEditNoteDialog from "./AddEditNoteDialog";


interface NoteProps {
    note: NoteModel
}

const Note = ( { note }: NoteProps) => {

    const [showEditDialogue, setShowEditDialogue] = useState(false);

    const wasUpdated = note.updatedAt > note.createdAt;

    const createdUpdatedAtTimestamp = (wasUpdated ? note.updatedAt : note.createdAt).toDateString();

    return (
        <>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow " onClick={() => setShowEditDialogue(true)}>
            <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <CardDescription>
                    {createdUpdatedAtTimestamp}
                    {wasUpdated && " (updated)"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="whitespace-pre-line">
                    {note.content}
                </p>
            </CardContent>
        </Card>

        <AddEditNoteDialog
            open={showEditDialogue}
            setOpen={setShowEditDialogue}
            noteToEdit={note}
        />


        </>
    )
}

export default Note