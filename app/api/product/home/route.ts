import { sanityClient } from '@/lib/sanity'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const home = searchParams.get('home')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const start = (page - 1) * limit

  try {
    let products = []

    if (home === 'true') {
      // Fetch up to 6 featured
      const featuredQuery = `
        *[_type == "product" && featured == true] 
        | order(_createdAt desc)[0...6]{
          _id,
          name,
          rating,
          "image": images[0].asset->url,
          price,
          salesPrice,
          featured
        }
      `
      const featured = await sanityClient.fetch(featuredQuery)

      if (featured.length < 6) {
        // Fetch normal products excluding already picked featured
        const normalQuery = `
          *[_type == "product" && !(featured == true)] 
          | order(_createdAt desc)[0...${6 - featured.length}]{
            _id,
            name,
            rating,
            "image": images[0].asset->url,
            price,
            salesPrice,
            featured
          }
        `
        const normal = await sanityClient.fetch(normalQuery)
        products = [...featured, ...normal]
      } else {
        products = featured
      }
    } else {
      // Paginated products (prioritize featured first)
      const paginatedQuery = `
        *[_type == "product"] 
        | order(featured desc, _createdAt desc)[${start}...${start + limit}]{
          _id,
          name,
          "images": images[].asset->url,
          price, 
          rating,
          salesPrice,
          sizes,
          colours,
          features,
          description,
          featured,
          "category": category->title
        }
      `
      products = await sanityClient.fetch(paginatedQuery)
    }

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Fetch failed', error },
      { status: 500 }
    )
  }
}
