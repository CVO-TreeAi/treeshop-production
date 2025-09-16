'use client'

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
    fontFamily: 'Helvetica',
  },
  header: {
    backgroundColor: '#2d5016',
    color: '#ffffff',
    padding: 30,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.9,
  },
  content: {
    padding: 30,
    backgroundColor: '#f9f9f9',
  },
  greeting: {
    fontSize: 16,
    color: '#2d5016',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 1.6,
    marginBottom: 20,
    color: '#333333',
  },
  estimateBox: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 8,
    borderLeft: '4px solid #4a7c59',
    marginVertical: 20,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  projectTitle: {
    fontSize: 18,
    color: '#2d5016',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  priceHighlight: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#2d5016',
    textAlign: 'center',
    marginVertical: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottom: '1px solid #dddddd',
  },
  detailLabel: {
    fontSize: 12,
    color: '#333333',
  },
  detailValue: {
    fontSize: 12,
    color: '#333333',
    fontFamily: 'Helvetica-Bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    backgroundColor: '#f0f8f0',
    fontFamily: 'Helvetica-Bold',
    marginTop: 10,
  },
  assumptionsTitle: {
    fontSize: 14,
    color: '#2d5016',
    fontFamily: 'Helvetica-Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  assumptionItem: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 5,
    paddingLeft: 15,
  },
  ctaSection: {
    textAlign: 'center',
    marginVertical: 30,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  ctaTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: '#2d5016',
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#4a7c59',
    color: '#ffffff',
    padding: '15px 30px',
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  validityText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 10,
  },
  featuresSection: {
    marginVertical: 20,
  },
  featuresTitle: {
    fontSize: 16,
    color: '#2d5016',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 15,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    borderLeft: '3px solid #4a7c59',
    marginBottom: 15,
  },
  featureTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#2d5016',
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 10,
    color: '#333333',
  },
  closing: {
    fontSize: 14,
    marginVertical: 20,
  },
  signature: {
    marginTop: 30,
  },
  signatureName: {
    fontFamily: 'Helvetica-Bold',
    color: '#2d5016',
    fontSize: 14,
  },
  signatureTitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 12,
    color: '#666666',
  },
  footer: {
    backgroundColor: '#2d5016',
    color: '#ffffff',
    padding: 20,
    textAlign: 'center',
  },
  footerTitle: {
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  footerInfo: {
    fontSize: 12,
    opacity: 0.9,
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

interface ProposalPDFProps {
  data: ProposalData
}

export default function ProposalPDF({ data }: ProposalPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌲 Your Free TreeShop Estimate</Text>
          <Text style={styles.headerSubtitle}>Professional Forestry Mulching & Land Clearing</Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.greeting}>Hi {data.customerName || 'Valued Customer'},</Text>
          
          <Text style={styles.paragraph}>
            Thank you for requesting an estimate from TreeShop! We've prepared a comprehensive proposal for your land clearing project in Florida.
          </Text>
          
          {/* Estimate Box */}
          <View style={styles.estimateBox}>
            <Text style={styles.projectTitle}>📍 Project: {data.projectAddress}</Text>
            <Text style={styles.priceHighlight}>${data.totalPrice?.toLocaleString()}</Text>
            
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.detailLabel}>📏 Acreage: {data.acreage} acres</Text>
              <Text style={styles.detailLabel}>🌳 Package: {formatPackageName(data.packageType)} DBH Clearing</Text>
              <Text style={styles.detailLabel}>⏱️ Timeline: {data.estimatedDays || Math.ceil(data.acreage * 0.5)} days</Text>
            </View>
            
            {/* Details Table */}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Base Clearing ({data.acreage} acres)</Text>
              <Text style={styles.detailValue}>${data.basePrice?.toLocaleString()}</Text>
            </View>
            
            {data.travelSurcharge && data.travelSurcharge > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Travel Surcharge</Text>
                <Text style={styles.detailValue}>${data.travelSurcharge.toLocaleString()}</Text>
              </View>
            )}
            
            {data.obstacleAdjustment && data.obstacleAdjustment > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Obstacle Adjustment</Text>
                <Text style={styles.detailValue}>${data.obstacleAdjustment.toLocaleString()}</Text>
              </View>
            )}
            
            <View style={styles.totalRow}>
              <Text style={styles.detailLabel}>Total Project Cost</Text>
              <Text style={styles.detailValue}>${data.totalPrice?.toLocaleString()}</Text>
            </View>
            
            {/* Assumptions */}
            {data.assumptions && data.assumptions.length > 0 && (
              <View>
                <Text style={styles.assumptionsTitle}>📋 Project Assumptions:</Text>
                {data.assumptions.map((assumption, index) => (
                  <Text key={index} style={styles.assumptionItem}>• {assumption}</Text>
                ))}
              </View>
            )}
          </View>
          
          {/* CTA Section */}
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to transform your property?</Text>
            <Text style={styles.ctaButton}>📞 Call (407) 555-0199 to Schedule</Text>
            <Text style={styles.validityText}>This estimate is valid for 30 days</Text>
          </View>
          
          {/* Features Section */}
          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>🏆 Why Choose TreeShop Florida?</Text>
            <View style={styles.featureGrid}>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>🚜 Professional Equipment</Text>
                <Text style={styles.featureDescription}>CAT forestry mulchers & specialized attachments</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>🌱 Eco-Friendly Process</Text>
                <Text style={styles.featureDescription}>Selective clearing preserves soil & nutrients</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>📜 Licensed & Insured</Text>
                <Text style={styles.featureDescription}>Fully bonded with comprehensive coverage</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureTitle}>⚡ Fast Turnaround</Text>
                <Text style={styles.featureDescription}>Most projects completed in 1-3 days</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.paragraph}>
            Questions about your estimate? Just call us at (407) 555-0199. We're here to help make your land clearing project a success!
          </Text>
          
          <View style={styles.signature}>
            <Text style={styles.paragraph}>Best regards,</Text>
            <Text style={styles.signatureName}>The TreeShop Team</Text>
            <Text style={styles.signatureTitle}>Florida's Premier Forestry Mulching Experts</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>TreeShop Florida</Text>
          <Text style={styles.footerInfo}>📧 office@fltreeshop.com | 📞 (407) 555-0199</Text>
          <Text style={styles.footerInfo}>🏆 Licensed & Insured | Serving Central Florida</Text>
        </View>
      </Page>
    </Document>
  )
}