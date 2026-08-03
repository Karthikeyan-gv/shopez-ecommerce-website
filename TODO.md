# Payment & Invoice Fix Plan (Demo Payment System)

## Backend
- [x] Fix `server/controllers/shop/order-controller.js` - removed PayPal API calls, simplified to demo payment system
  - `createOrder` now saves order directly and returns `{ success, orderId }` (no PayPal redirect)
  - `capturePayment` now accepts only `{ orderId }`, marks order as paid/confirmed, updates stock, deletes cart

## Frontend
- [x] Update `client/src/pages/shopping-view/checkout.jsx` - "Proceed to Payment" button navigates to `/shop/demo-payment?orderId=...`
- [x] Create `client/src/pages/shopping-view/demo-payment.jsx` - demo payment page with mock card form
- [x] Update `client/src/App.jsx` - add `/shop/demo-payment` route, remove `/shop/paypal-return` route, keep `/shop/paypal-cancel` and `/shop/payment-success`
- [x] Delete `client/src/pages/shopping-view/paypal-return.jsx` - no longer needed
- [x] Create `client/src/pages/shopping-view/paypal-cancel.jsx` - Payment Cancelled page
- [x] Enhance `client/src/pages/shopping-view/payment-success.jsx` - show order summary + invoice
- [x] Create `client/src/components/shopping-view/invoice.jsx` - printable invoice component
- [x] Update `client/src/components/shopping-view/order-details.jsx` - add Download Invoice button
- [x] Update `client/src/components/admin-view/order-details.jsx` - add Download Invoice button

## Follow-up
- [x] Verify client build succeeds (`npx vite build` - exit 0)
- [x] Verify server syntax check passes (`node --check` - exit 0)
- [x] Added products to seed data (52 total: men=10, women=10, kids=10, footwear=10, accessories=12)
- [x] Fixed stale `sku` unique index error in seed script (drops index before insert)
- [x] Ran seed script successfully - database populated with 52 products
- [ ] Test demo payment flow in browser (checkout -> demo-payment -> payment-success)
- [ ] Test invoice download/print functionality in browser
