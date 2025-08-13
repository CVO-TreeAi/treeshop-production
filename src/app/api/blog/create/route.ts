import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'src/content/blog')

export async function POST(request: NextRequest) {
  try {
    const { slug, content } = await request.json()
    
    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Missing slug or content' }, 
        { status: 400 }
      )
    }

    // Ensure the blog directory exists
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // Create the file path
    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    
    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' }, 
        { status: 409 }
      )
    }

    // Write the file
    fs.writeFileSync(filePath, content, 'utf8')

    return NextResponse.json({ 
      message: 'Blog post created successfully',
      slug,
      path: filePath 
    })

  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to create blog post' }, 
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { slug, content } = await request.json()
    
    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Missing slug or content' }, 
        { status: 400 }
      )
    }

    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      )
    }

    // Update the file
    fs.writeFileSync(filePath, content, 'utf8')

    return NextResponse.json({ 
      message: 'Blog post updated successfully',
      slug,
      path: filePath 
    })

  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Missing slug parameter' }, 
        { status: 400 }
      )
    }

    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Post not found' }, 
        { status: 404 }
      )
    }

    // Delete the file
    fs.unlinkSync(filePath)

    return NextResponse.json({ 
      message: 'Blog post deleted successfully',
      slug 
    })

  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' }, 
      { status: 500 }
    )
  }
}