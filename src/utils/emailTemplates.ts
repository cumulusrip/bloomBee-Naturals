import { Order, StoreSettings } from '../types';

export function generateOrderConfirmationEmailHtml(order: Order, store: StoreSettings): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0e6d6;">
          <strong style="color: #1F2937; font-size: 15px;">${item.product.title}</strong>
          <br/>
          <span style="color: #786C5E; font-size: 13px;">Pack Size: <strong>${item.variant.weight}</strong> | Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #f0e6d6; text-align: right; font-weight: 600; color: #1F2937;">
          ₹${(item.variant.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - ${order.orderNumber}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #FAF8F5; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1F2937;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFE5D5; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    
    <!-- Brand Header -->
    <div style="background: linear-gradient(135deg, #1E3F20 0%, #2D5A27 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <div style="display: inline-block; background: #E69500; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px;">
        100% Raw &amp; Lab Tested
      </div>
      <h1 style="margin: 0; font-size: 28px; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; color: #FFFFFF;">
        BloomBee Naturals
      </h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; color: #D4E8D2;">Pure Forest Nectar • Farmgate to Your Table</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 28px;">
      <div style="background: #FEF7EB; border: 1px solid #F5DEB3; border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center;">
        <h2 style="margin: 0 0 6px 0; color: #9A5B00; font-size: 20px;">Thank You, ${order.customer.fullName}</h2>
        <p style="margin: 0; color: #785315; font-size: 14px; line-height: 1.5;">
          Your order <strong>#${order.orderNumber}</strong> has been confirmed and is being processed for dispatch.
        </p>
      </div>

      <!-- Mandatory Delivery Notice -->
      <div style="background: #F0F7EE; border-left: 4px solid #2D5A27; padding: 14px 16px; border-radius: 6px; margin-bottom: 28px;">
        <p style="margin: 0; font-size: 14px; font-weight: 600; color: #1E3F20;">
          Standard Delivery Time: 5–7 Business Days across India.
        </p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #4B6E49;">
          Handled with care in shatter-proof eco-bubble packaging.
        </p>
      </div>

      <!-- Order Details -->
      <h3 style="margin: 0 0 12px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; color: #786C5E;">
        Order Summary
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <!-- Price Breakdown -->
      <div style="background: #FAF8F5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #555;">
          <span>Subtotal:</span>
          <span style="font-weight: 600;">₹${order.pricing.subtotal.toLocaleString('en-IN')}</span>
        </div>
        ${
          order.pricing.discount > 0
            ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #2D5A27;">
          <span>Discount (${order.pricing.couponCode || 'Promo'}):</span>
          <span>-₹${order.pricing.discount.toLocaleString('en-IN')}</span>
        </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #555;">
          <span>Pan-India Shipping:</span>
          <span style="font-weight: 600; color: ${order.pricing.shipping === 0 ? '#2D5A27' : '#1F2937'};">
            ${order.pricing.shipping === 0 ? 'FREE' : `₹${order.pricing.shipping}`}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px dashed #D9CDBF; font-size: 16px; font-weight: 700; color: #1F2937;">
          <span>Total Paid:</span>
          <span style="color: #9A5B00;">₹${order.pricing.total.toLocaleString('en-IN')}</span>
        </div>
        <div style="margin-top: 6px; font-size: 12px; color: #2D5A27; text-align: right;">
          ✓ Paid via Razorpay (${order.payment.razorpayPaymentId || 'Online UPI/Card'})
        </div>
      </div>

      <!-- Shipping Address -->
      <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #1F2937;">Shipping To:</h3>
      <p style="margin: 0 0 24px 0; font-size: 14px; color: #4B5563; line-height: 1.6; background: #ffffff; border: 1px solid #eee; padding: 12px; border-radius: 8px;">
        <strong>${order.customer.fullName}</strong><br/>
        ${order.customer.address}<br/>
        ${order.customer.landmark ? `Landmark: ${order.customer.landmark}<br/>` : ''}
        ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}<br/>
        Phone: ${order.customer.phone} | Email: ${order.customer.email}
      </p>

      <!-- Trust Badges in Email -->
      <div style="border-top: 1px solid #EFE5D5; padding-top: 20px; text-align: center;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #786C5E;">
          THE BLOOMBEE PURITY PROMISE
        </p>
        <p style="margin: 0; font-size: 12px; color: #888; line-height: 1.5;">
          ✓ 100% Raw &amp; Unheated &nbsp;|&nbsp; ✓ 0% Added Sugar Syrups (NMR Tested) &nbsp;|&nbsp; ✓ Pure Glass Jar Packaging
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #F4EFEA; padding: 20px; text-align: center; font-size: 12px; color: #786C5E;">
      <p style="margin: 0 0 6px 0;">Need help? Reply directly to this email or reach us at <a href="mailto:${store.supportEmail}" style="color: #9A5B00; font-weight: 600; text-decoration: none;">${store.supportEmail}</a> or WhatsApp <a href="https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #2D5A27; font-weight: 600; text-decoration: none;">${store.whatsappNumber}</a>.</p>
      <p style="margin: 0; color: #A0988E;">&copy; ${new Date().getFullYear()} ${store.name}. All rights reserved.</p>
    </div>

  </div>
</body>
</html>
`;
}

export function generateStatusUpdateEmailHtml(order: Order, store: StoreSettings, status: string): string {
  const statusColors: Record<string, { bg: string; text: string; label: string; desc: string }> = {
    processing: {
      bg: '#FEF7EB',
      text: '#9A5B00',
      label: 'Order is Being Packed',
      desc: 'Your honey jars are being hand-inspected, packed with eco-bubble cushioning, and prepared for dispatch.',
    },
    shipped: {
      bg: '#EAF4FE',
      text: '#1E40AF',
      label: 'Order Dispatched & In Transit',
      desc: 'Your package has been handed over to our courier partner and is on its way to your doorstep.',
    },
    delivered: {
      bg: '#F0FDF4',
      text: '#166534',
      label: 'Order Delivered Successfully',
      desc: 'Your BloomBee Naturals package has been delivered. Thank you for choosing pure natural harvests.',
    },
    cancelled: {
      bg: '#FEF2F2',
      text: '#991B1B',
      label: 'Order Cancelled',
      desc: 'Your order has been cancelled and any refund has been initiated to your original payment method.',
    },
  };

  const currentConfig = statusColors[status] || statusColors.processing;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order #${order.orderNumber} Status: ${currentConfig.label}</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #FAF8F5; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1F2937;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFE5D5; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.04);">
    
    <!-- Brand Header -->
    <div style="background: #1E3F20; padding: 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-family: 'Playfair Display', Georgia, serif; font-weight: 700; color: #FFFFFF;">
        ${store.name}
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #D4E8D2;">Order Status Update</p>
    </div>

    <!-- Status Box -->
    <div style="padding: 28px;">
      <div style="background: ${currentConfig.bg}; border: 1px solid ${currentConfig.text}30; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
        <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${currentConfig.text}; font-weight: 700;">Status Notification</span>
        <h2 style="margin: 6px 0; color: ${currentConfig.text}; font-size: 22px;">${currentConfig.label}</h2>
        <p style="margin: 0; color: #4B5563; font-size: 14px; line-height: 1.5;">${currentConfig.desc}</p>
      </div>

      <!-- Tracking details if shipped -->
      ${
        order.tracking && status === 'shipped'
          ? `
      <div style="background: #FAF8F5; border: 1px solid #E2D7C8; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #1F2937;">Courier Tracking Details:</h3>
        <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Courier Partner:</strong> ${order.tracking.carrier}</p>
        <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Tracking AWB:</strong> <span style="font-family: monospace; background: #fff; padding: 2px 6px; border: 1px solid #ddd; border-radius: 4px;">${order.tracking.trackingNumber}</span></p>
        <p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Estimated Delivery:</strong> ${order.tracking.estimatedDelivery}</p>
        <div style="margin-top: 14px;">
          <a href="${order.tracking.trackingUrl}" target="_blank" style="display: inline-block; background: #2D5A27; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Track Package Live →
          </a>
        </div>
      </div>
      `
          : ''
      }

      <!-- Mandatory Delivery Notice -->
      <div style="background: #F0F7EE; border-left: 4px solid #2D5A27; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1E3F20;">
          Standard Delivery Time: 5–7 Business Days across India.
        </p>
      </div>

      <!-- Recipient -->
      <p style="font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
        <strong>Recipient:</strong> ${order.customer.fullName}<br/>
        <strong>Delivery Address:</strong> ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
      </p>

    </div>

    <!-- Footer -->
    <div style="background: #F4EFEA; padding: 18px; text-align: center; font-size: 12px; color: #786C5E;">
      <p style="margin: 0 0 4px 0;">Questions about your delivery? Write to <a href="mailto:${store.supportEmail}" style="color: #9A5B00; font-weight: 600;">${store.supportEmail}</a></p>
      <p style="margin: 0; color: #A0988E;">&copy; ${new Date().getFullYear()} ${store.name}.</p>
    </div>
  </div>
</body>
</html>
`;
}
