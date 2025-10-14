This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Razorpay Payment Flow

This project implements a complete Razorpay payment flow for buying credits. Below is the step-by-step process:

### 1. Backend: Create Order

- The backend exposes an endpoint (e.g., `/api/payments/buy-credits`) that receives the amount, credits, and userId.
- It creates a Razorpay order and saves it in the database.
- Returns JSON with `orderId`, `amount`, `currency`, and optionally `razorpayKey`.

### 2. Frontend: Buy Credits Page

- The user navigates to `/buy-credits?orderId=...&amount=...`.
- The page fetches order details from the backend using the orderId.
- Once details are loaded, it loads the Razorpay checkout script and opens the payment modal automatically.
- On payment success, the Razorpay handler redirects to `/payment-success?payment_id=...`.
- On payment failure, you can redirect to `/payment-failure?payment_id=...&reason=...`.

### 3. Backend: Razorpay Webhook

- Configure a webhook endpoint (e.g., `/api/razorpay/webhook`) in your Razorpay dashboard.
- Razorpay sends a POST request to this endpoint after payment events.
- The backend verifies the signature, updates the order status, and credits the user's account if payment is successful.

### 4. Frontend: Payment Success Page

- The `/payment-success` page reads the `payment_id` from the query string.
- It polls the backend (e.g., `/api/payment/status?payment_id=...`) to confirm payment status.
- Shows a success message when payment is confirmed and credits are added.

### 5. Frontend: Payment Failure Page

- The `/payment-failure` page displays a clear error message, payment ID, and reason if available.
- Provides a link to retry buying credits.

### 6. Environment Variables

- Store your Razorpay keys and API URLs in the `.env` file:
  - `NEXT_PUBLIC_RAZORPAY_KEY`
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_BASE_URL`
  - Backend: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`

### 7. Example API Responses

- **Order Details:**

  ```json
  {
    "orderId": "order_xyz",
    "amount": 50000,
    "currency": "INR",
    "razorpayKey": "your_key"
  }
  ```

- **Payment Status:**

  ```json
  {
    "status": "captured"
  }
  ```

### 8. Error Handling

- The frontend shows loading, error, and success/failure states.
- The backend should handle and log webhook errors for troubleshooting.

---

For more details, see the code in `src/app/buy-credits/page.tsx`, `src/app/payment-success/page.tsx`, and `src/app/payment-failure/page.tsx`.

## S3 Static Hosting Deployment

This application is configured for deployment to AWS S3 as a static website. Here's how to deploy:

### Prerequisites
1. AWS CLI installed and configured
2. S3 bucket created with static website hosting enabled
3. Optional: CloudFront distribution for CDN

### Local Deployment
1. Copy the environment template:
   ```bash
   cp .env.s3.example .env.local
   ```

2. Update environment variables in `.env.local`:
   ```bash
   S3_BUCKET_NAME=your-smart-tutor-bucket
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   NEXT_PUBLIC_RAZORPAY_KEY=your-razorpay-key
   NEXT_PUBLIC_BASE_URL=https://your-domain.com
   ```

3. Build and deploy:
   ```bash
   # Manual deployment
   npm run build
   ./deploy-s3.sh
   
   # Or use npm scripts
   export S3_BUCKET_NAME=your-bucket-name
   npm run deploy:s3
   ```

### GitHub Actions Deployment
Set up the following secrets in your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID` (optional)
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY`
- `NEXT_PUBLIC_BASE_URL`

The workflow will automatically deploy on pushes to main/master branch.

### S3 Bucket Configuration
Your S3 bucket should have:
1. Static website hosting enabled
2. Public read access for objects
3. Proper bucket policy for public access
4. Index document: `index.html`
5. Error document: `404.html` (optional)

### Important Notes
- The app uses static export (`output: 'export'`) for S3 compatibility
- Images are unoptimized for static hosting
- API routes are not supported in static export
- Dynamic server-side features are not available
