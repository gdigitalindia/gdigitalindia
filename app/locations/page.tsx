import Link from 'next/link'
import Image from 'next/image'
import { connectDB } from '@/lib/mongodb'
import Location from '@/models/Location'
import styles from './locations.module.css'
import LocationsClient from './LocationsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Our Locations | Digital Marketing Agency Across India | G Digital India',
  description: 'Explore G Digital India locations across India. We deliver top-tier SEO, Web Design, PPC, and IT solutions in Jaipur, Delhi NCR, Mumbai, and beyond.'
}

export default async function LocationsPage() {
  let locations: any[] = []
  try {
    const conn = await connectDB()
    if (conn) {
      const data = await Location.find().sort({ order: 1, createdAt: -1 }).lean()
      locations = JSON.parse(JSON.stringify(data))
    }
  } catch (err) {
    console.error('Locations fetch error:', err)
  }

  return <LocationsClient initialLocations={locations} />
}
