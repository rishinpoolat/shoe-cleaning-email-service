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

interface LabelEmailProps {
  customerName: string
  orderNumber: string
  orderDate: string
  packageName: string
  shoeType: string
  quantity: number
  specialInstructions?: string
}

export const LabelEmail = ({
  customerName,
  orderNumber,
  orderDate,
  packageName,
  shoeType,
  quantity,
  specialInstructions,
}: LabelEmailProps) => (
  <Html>
    <Head />
    <Preview>Your shipping label is ready - {orderNumber}</Preview>
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
          <Heading style={h1}>Your Shipping Label is Ready!</Heading>
          
          <Text style={text}>
            Hi {customerName},
          </Text>
          
          <Text style={text}>
            Great news! Your prepaid shipping label for order <strong>{orderNumber}</strong> is attached to this email.
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

          <Section style={instructions}>
            <Heading style={h2}>Shipping Instructions</Heading>
            <Text style={text}>
              1. <strong>Print the attached label</strong> and securely attach it to your package
            </Text>
            <Text style={text}>
              2. <strong>Package your shoes</strong> in a sturdy box with adequate protection
            </Text>
            <Text style={text}>
              3. <strong>Drop off at any Royal Mail location</strong> or schedule a collection
            </Text>
            <Text style={text}>
              4. <strong>Keep your receipt</strong> for tracking purposes
            </Text>
          </Section>

          <Section style={trackingSection}>
            <Text style={text}>
              Once we receive your shoes, we'll send you a confirmation email and begin the cleaning process immediately.
            </Text>
          </Section>

          <Hr style={hr} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Questions? Reply to this email or contact us at{' '}
              <a href="mailto:info@offseasonshoes.com" style={link}>
                info@offseasonshoes.com
              </a>
            </Text>
            <Text style={footerText}>
              Thank you for choosing OFFseason for your shoe cleaning needs!
            </Text>
          </Section>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default LabelEmail

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

const instructions = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const trackingSection = {
  backgroundColor: '#d4edda',
  border: '1px solid #c3e6cb',
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