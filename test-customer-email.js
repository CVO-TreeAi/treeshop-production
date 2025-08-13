// Quick test to send customer email directly
const testCustomerEmail = async () => {
  try {
    console.log('🧪 Testing customer email send...');
    
    const response = await fetch('http://localhost:3232/api/send-gmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailType: 'customer_proposal',
        data: {
          customerName: 'Test Customer',
          customerEmail: 'cvo@treeai.us',
          projectAddress: '123 Test Lane, Orlando FL',
          acreage: 2.5,
          packageType: 'medium',
          totalPrice: 6250,
          basePrice: 5500,
          travelSurcharge: 750,
          obstacleAdjustment: 0,
          assumptions: ['Test assumption 1', 'Test assumption 2'],
          estimatedDays: 2
        }
      })
    });
    
    const result = await response.json();
    console.log('🧪 Test result:', result);
    
    if (result.success) {
      console.log('✅ Customer email test SUCCESSFUL');
      console.log('📧 Sent to:', result.to);
      console.log('📨 Message ID:', result.messageId);
    } else {
      console.error('❌ Customer email test FAILED:', result.error);
    }
    
  } catch (error) {
    console.error('🚨 Test error:', error);
  }
};

testCustomerEmail();