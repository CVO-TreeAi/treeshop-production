import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/firestore/collections'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, COLLECTIONS.SITE_MEDIA, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }

    const media = {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
      updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date()
    }

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    
    const updateData = {
      type: body.type,
      url: body.url,
      alt: body.alt,
      caption: body.caption,
      title: body.title,
      description: body.description,
      category: body.category,
      featured: body.featured,
      published: body.published,
      dimensions: body.dimensions,
      fileSize: body.fileSize,
      mimeType: body.mimeType,
      updatedAt: new Date()
    }

    const docRef = doc(db, COLLECTIONS.SITE_MEDIA, id)
    await updateDoc(docRef, updateData)

    return NextResponse.json({ message: 'Media updated successfully' })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const docRef = doc(db, COLLECTIONS.SITE_MEDIA, id)
    await deleteDoc(docRef)

    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
}