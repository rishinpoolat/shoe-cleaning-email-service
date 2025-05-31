import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface ReadyToShipEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  packageName: string
  shoeType: string
  quantity: number
  specialInstructions?: string
  estimatedDelivery: string
  trackingNumber?: string
}

export const ReadyToShipEmail = ({
  customerName,
  orderNumber,
  orderDate,
  packageName,
  shoeType,
  quantity,
  specialInstructions,
  estimatedDelivery,
  trackingNumber,
}: ReadyToShipEmailProps) => (
  <Html>
    <Head />
    <Preview>Your shoes are ready and on their way! - {orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img
            src="https://offseasonshoes.com/logo.png"
            width="150"
            height="auto"
            alt="OFFseason"
            style={logo}
          />
        </Section>

        <Section style={content}>
          <Heading style={h1}>Your Shoes Are Sparkling Clean! ✨</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          
          <Text style={text}>
            Fantastic news! Your shoes from order <strong>{orderNumber}</strong> have been 
            professionally cleaned and are now on their way back to you.
          </Text>

          <Section style={orderDetails}>
            <Heading style={h2}>Order Details</Heading>
            <Text style={detailText}>
              <strong>Order Number:</strong> {orderNumber}
            </Text>
            <Text style={detailText}>
              <strong>Order Date:</strong> {orderDate}
            </Text>
            <Text style={detailText}>
              <strong>Service:</strong> {packageName}
            </Text>
            <Text style={detailText}>
              <strong>Shoe Type:</strong> {shoeType}
            </Text>
            <Text style={detailText}>
              <strong>Quantity:</strong> {quantity} pair{quantity > 1 ? 's' : ''}
            </Text>
            {specialInstructions && (
              <Text style={detailText}>
                <strong>Special Instructions:</strong> {specialInstructions}
              </Text>
            )}
          </Section>

          <Section style={shippingSection}>
            <Heading style={h2}>Shipping Information</Heading>
            <Text style={text}>
              📦 <strong>Status:</strong> Your shoes have been shipped!
            </Text>
            <Text style={text}>
              🚚 <strong>Estimated Delivery:</strong> {estimatedDelivery}
            </Text>
            {trackingNumber && (
              <Text style={text}>
                📋 <strong>Tracking Number:</strong> {trackingNumber}
              </Text>
            )}
          </Section>

          <Section style={completedSection}>
            <Heading style={h2}>What We've Done</Heading>
            <Text style={text}>
              ✅ <strong>Thorough Inspection:</strong> Assessed your shoes' condition and cleaning needs
            </Text>
            <Text style={text}>
              ✅ <strong>Professional Cleaning:</strong> Deep cleaned using premium, shoe-safe products
            </Text>
            <Text style={text}>
              ✅ <strong>Stain Removal:</strong> Treated and removed stubborn stains and scuff marks
            </Text>
            <Text style={text}>
              ✅ <strong>Protection Applied:</strong> Added protective coating to help maintain cleanliness
            </Text>
            <Text style={text}>
              ✅ <strong>Quality Check:</strong> Final inspection to ensure perfect results
            </Text>
          </Section>

          <Section style={careSection}>
            <Heading style={h2}>Care Tips for Your Clean Shoes</Heading>
            <Text style={text}>
              • Store in a cool, dry place away from direct sunlight
            </Text>
            <Text style={text}>
              • Use shoe trees to maintain shape when not wearing
            </Text>
            <Text style={text}>
              • Clean spills and dirt promptly to prevent staining
            </Text>
            <Text style={text}>
              • Consider regular cleaning every 3-6 months for best results
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              We hope you love your refreshed shoes! If you have any questions about 
              your order or our cleaning process, please don't hesitate to reach out.
            </Text>
            <Text style={footerText}>
              Questions? Reply to this email or contact us at{' '}
              <a href="mailto:info@offseasonshoes.com" style={link}>
                info@offseasonshoes.com
              </a>
            </Text>
            <Text style={footerText}>
              Thank you for choosing OFFseason - we look forward to serving you again!
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ReadyToShipEmail

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  padding: '20px 0',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
}

const content = {
  padding: '20px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0 10px',
}

const text = {
  color: '#444',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const detailText = {
  color: '#444',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const orderDetails = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const shippingSection = {
  backgroundColor: '#d4edda',
  border: '1px solid #c3e6cb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const completedSection = {
  backgroundColor: '#cce5ff',
  border: '1px solid #99d6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const careSection = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const hr = {
  borderColor: '#e9ecef',
  margin: '20px 0',
}

const footer = {
  textAlign: 'center' as const,
  margin: '20px 0',
}

const footerText = {
  color: '#6c757d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const link = {
  color: '#007bff',
  textDecoration: 'underline',
}