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

interface ShipmentReceivedEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  packageName: string
  shoeType: string
  quantity: number
  specialInstructions?: string
  estimatedCompletion: string
}

export const ShipmentReceivedEmail = ({
  customerName,
  orderNumber,
  orderDate,
  packageName,
  shoeType,
  quantity,
  specialInstructions,
  estimatedCompletion,
}: ShipmentReceivedEmailProps) => (
  <Html>
    <Head />
    <Preview>We've received your shoes - {orderNumber}</Preview>
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
          <Heading style={h1}>We've Received Your Shoes! 👟</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          
          <Text style={text}>
            Great news! We've successfully received your shoes for order <strong>{orderNumber}</strong> 
            and our expert cleaning team has begun the process.
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

          <Section style={statusSection}>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={text}>
              ✅ <strong>Received:</strong> Your shoes have arrived safely at our facility
            </Text>
            <Text style={text}>
              🔄 <strong>In Progress:</strong> Our team is carefully cleaning your shoes
            </Text>
            <Text style={text}>
              📦 <strong>Estimated Completion:</strong> {estimatedCompletion}
            </Text>
          </Section>

          <Section style={processSection}>
            <Heading style={h2}>Our Cleaning Process</Heading>
            <Text style={text}>
              1. <strong>Inspection:</strong> Thorough assessment of your shoes' condition
            </Text>
            <Text style={text}>
              2. <strong>Pre-treatment:</strong> Removal of dirt, stains, and scuff marks
            </Text>
            <Text style={text}>
              3. <strong>Deep Clean:</strong> Professional cleaning using premium products
            </Text>
            <Text style={text}>
              4. <strong>Protection:</strong> Application of protective coatings
            </Text>
            <Text style={text}>
              5. <strong>Quality Check:</strong> Final inspection before return shipping
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              We'll send you another email once your shoes are cleaned and ready to ship back to you.
            </Text>
            <Text style={footerText}>
              Questions? Reply to this email or contact us at{' '}
              <a href="mailto:info@offseasonshoes.com" style={link}>
                info@offseasonshoes.com
              </a>
            </Text>
            <Text style={footerText}>
              Thank you for trusting OFFseason with your shoes!
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ShipmentReceivedEmail

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

const statusSection = {
  backgroundColor: '#d4edda',
  border: '1px solid #c3e6cb',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const processSection = {
  backgroundColor: '#e2e3e5',
  border: '1px solid #d6d8db',
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