'use client'

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'

// Simple styles that work reliably
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    backgroundColor: '#2d5016',
    color: '#ffffff',
    padding: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#2d5016',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  price: {
    fontSize: 24,
    textAlign: 'center',
    color: '#2d5016',
    marginVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  label: {
    fontSize: 11,
  },
  value: {
    fontSize: 11,
  },
  footer: {
    backgroundColor: '#2d5016',
    color: '#ffffff',
    padding: 15,
    textAlign: 'center',
    marginTop: 30,
  },
  image: {
    width: '100%',
    height: 300,
    objectFit: 'cover',
    marginVertical: 20,
  },
  imageCaption: {
    fontSize: 10,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 20,
  },
})

interface ProposalData {
  customerName?: string
  customerEmail: string
  projectAddress: string
  acreage: number
  packageType: string
  totalPrice: number
  basePrice: number
  travelSurcharge?: number
  obstacleAdjustment?: number
  assumptions?: string[]
  estimatedDays?: number
}

// Helper function to format package names
function formatPackageName(packageType: string): string {
  const packages: Record<string, string> = {
    small: '4" Small',
    medium: '6" Medium', 
    large: '8" Large',
    xlarge: '10" Extra Large',
  }
  return packages[packageType] || '6" Medium'
}

interface SimpleProposalPDFProps {
  data: ProposalData
}

export default function SimpleProposalPDF({ data }: SimpleProposalPDFProps) {
  return (
    <Document>
      {/* Page 1: Main Proposal */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your TreeShop Estimate</Text>
          <Text style={styles.subtitle}>Professional Forestry Mulching & Land Clearing</Text>
        </View>
        
        {/* Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Information</Text>
          <Text style={styles.text}>Name: {data.customerName || 'Valued Customer'}</Text>
          <Text style={styles.text}>Email: {data.customerEmail}</Text>
          <Text style={styles.text}>Project Address: {data.projectAddress}</Text>
        </View>
        
        {/* Project Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Details</Text>
          <Text style={styles.text}>Property Size: {data.acreage} acres</Text>
          <Text style={styles.text}>Package: {formatPackageName(data.packageType)} DBH Clearing</Text>
          <Text style={styles.text}>Estimated Timeline: {data.estimatedDays || Math.ceil(data.acreage * 0.5)} days</Text>
        </View>
        
        {/* Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Breakdown</Text>
          
          <View style={styles.row}>
            <Text style={styles.label}>Base Clearing ({data.acreage} acres)</Text>
            <Text style={styles.value}>${data.basePrice?.toLocaleString()}</Text>
          </View>
          
          {data.travelSurcharge && data.travelSurcharge > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Travel Surcharge</Text>
              <Text style={styles.value}>${data.travelSurcharge.toLocaleString()}</Text>
            </View>
          )}
          
          {data.obstacleAdjustment && data.obstacleAdjustment > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Obstacle Adjustment</Text>
              <Text style={styles.value}>${data.obstacleAdjustment.toLocaleString()}</Text>
            </View>
          )}
          
          <Text style={styles.price}>Total: ${data.totalPrice?.toLocaleString()}</Text>
        </View>
        
        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <Text style={styles.text}>Ready to transform your property?</Text>
          <Text style={styles.text}>Call us at (407) 555-0199 to schedule your project.</Text>
          <Text style={styles.text}>This estimate is valid for 30 days.</Text>
        </View>
      </Page>

      {/* Page 2: Value Proposition & Visual */}
      <Page size="A4" style={styles.page}>
        {/* TreeShop Value & Process */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose TreeShop Florida?</Text>
          <Text style={styles.text}>• Professional equipment: CAT forestry mulchers & Fecon attachments</Text>
          <Text style={styles.text}>• Eco-friendly selective clearing - preserves soil & nutrients</Text>
          <Text style={styles.text}>• Licensed & insured with comprehensive coverage</Text>
          <Text style={styles.text}>• Fast turnaround: 1-3 days for most projects</Text>
          <Text style={styles.text}>• Improves cell signal, airflow, and property value ($3-5 ROI per $1)</Text>
          <Text style={styles.text}>• Zero cleanup required - creates natural fire safety barriers</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Zero-Surprises Process</Text>
          <Text style={styles.text}>1. Office validation within 4 hours (permits, wetlands, access)</Text>
          <Text style={styles.text}>2. Consultation call to confirm project details</Text>
          <Text style={styles.text}>3. Professional mulching with guaranteed finish points</Text>
          <Text style={styles.text}>4. Final walk-through to ensure your satisfaction</Text>
          <Text style={styles.text}>• 30-day pricing guarantee locked in at today's rates</Text>
        </View>
        
        {/* Professional Work Image */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>See the TreeShop Difference</Text>
          <Image 
            style={styles.image} 
            src="https://images.unsplash.com/photo-1594563628442-1d0de9c6b5bc?q=80&w=2000&auto=format&fit=crop"
          />
          <Text style={styles.imageCaption}>
            Professional forestry mulching in action - selective clearing that preserves valuable trees while creating usable space
          </Text>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text>TreeShop Florida</Text>
          <Text>office@fltreeshop.com | (407) 555-0199</Text>
          <Text>Licensed & Insured | Serving Central Florida</Text>
        </View>
      </Page>
    </Document>
  )
}