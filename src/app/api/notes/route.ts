import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note"
import { auth } from "@clerk/nextjs";

import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { noteIndex } from "@/lib/db/pinecone";




export const POST = async ( req: Request ) => {

    try {
        const body = await req.json()
        console.log(body)

        const parseResult = createNoteSchema.safeParse(body);

        if(!parseResult.success) {
            return Response.json({error: "Invalid Input!"}, { status: 400 })
        }


        const { title, content } = parseResult.data;

        const { userId } = auth();

        if(!userId) {
            return Response.json({error: "Unauthorized"}, { status: 401 })
            }


        const embedding = await getEmbeddingForNote(title, content);

        const note = await prisma.$transaction(async (tx) => {

            const note = await tx.note.create({
                data: {
                    title,
                    content,
                    userId
                }
            });

            await noteIndex.upsert([
                {
                    id: note.id,
                    values: embedding,
                    metadata: {
                        userId,
                    }
                }
            ])

            return note;

        })

        

        return Response.json({note}, {status: 201})


    } catch (error) {
        console.log(error)
        return Response.json({error : "Internal server error"},{ status: 500 })
    }

}



export const PUT = async ( req: Request ) => {
    try {
        const body = await req.json();
    
        const parseResult = updateNoteSchema.safeParse(body);
    
        if (!parseResult.success) {
          console.error(parseResult.error);
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }
    
        const { id, title, content } = parseResult.data;
    
        const note = await prisma.note.findUnique({ where: { id } });
    
        if (!note) {
          return Response.json({ error: "Note not found" }, { status: 404 });
        }
    
        const { userId } = auth();
    
        if (!userId || userId !== note.userId) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const embedding = await getEmbeddingForNote(title, content);


        const updatedNote = await prisma.$transaction(async (tx) => {
            const updatedNote = await tx.note.update({
                where: { id },
                data: {
                  title,
                  content,
                },
              });

              await noteIndex.upsert([
                {
                    id,
                    values: embedding,
                    metadata: {
                        userId,
                    }
                }
            ])

            return updatedNote;
        })
    
       
    
        return Response.json({ updatedNote }, { status: 200 });
      } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}




export const DELETE = async ( req: Request ) => {
    try {

        const body = await req.json()
        console.log(body)

        const parseResult = deleteNoteSchema.safeParse(body);

        if(!parseResult.success) {
            return Response.json({error: "Invalid Input!"}, { status: 400 })
        }


        const { id } = parseResult.data;


        const note = await prisma.note.findUnique({
            where: {
                id
            }
        })

        if(!note) {
            return Response.json({error: "Note not found!"}, { status: 404 })
        }


        const { userId } = auth();

        if(!userId || userId !== note.userId) {
            return Response.json({error: "Unauthorized"}, { status: 401 })
        }

        await prisma.$transaction(async (tx) => {
            await tx.note.delete({
                where: {
                    id
                }
            })

            await  noteIndex.deleteOne(id);
            
        })


        

        return Response.json({ message: "Note deleted successfully" }, {status: 200})
        
    } catch (error) {
        console.log(error)
        return Response.json({error : "Internal server error"},{ status: 500 })
    }
}


async function getEmbeddingForNote(title: string, content: string | undefined) {
    return getEmbedding(title + "\n\n" + content ?? "");
}