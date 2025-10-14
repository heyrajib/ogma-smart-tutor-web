#!/bin/bash

# S3 Static Website Deployment Script
# Make sure to set these environment variables:
# - S3_BUCKET_NAME: Your S3 bucket name
# - CLOUDFRONT_DISTRIBUTION_ID: Your CloudFront distribution ID (optional)
# - AWS_PROFILE: Your AWS profile (optional)

set -e

echo "🚀 Starting S3 deployment..."

# Check if S3_BUCKET_NAME is set
if [ -z "$S3_BUCKET_NAME" ]; then
    echo "❌ Error: S3_BUCKET_NAME environment variable is not set"
    echo "Please set it with: export S3_BUCKET_NAME=your-bucket-name"
    exit 1
fi

# Build the application
echo "📦 Building Next.js application..."
npm run build

# Check if build was successful
if [ ! -d "out" ]; then
    echo "❌ Error: Build failed or 'out' directory not found"
    exit 1
fi

# Sync to S3
echo "☁️  Uploading to S3 bucket: $S3_BUCKET_NAME"
aws s3 sync out/ s3://$S3_BUCKET_NAME --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "*.json" \
    --exclude "*.xml"

# Upload HTML files with shorter cache
aws s3 sync out/ s3://$S3_BUCKET_NAME --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --include "*.html" \
    --include "*.json" \
    --include "*.xml"

# Configure S3 bucket for static website hosting
echo "🌐 Configuring S3 bucket for static website hosting..."
aws s3 website s3://$S3_BUCKET_NAME \
    --index-document index.html \
    --error-document 404.html

# Set correct content types
aws s3 cp s3://$S3_BUCKET_NAME s3://$S3_BUCKET_NAME --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "*.json" \
    --exclude "*.xml"

echo "✅ S3 upload completed!"

# Invalidate CloudFront cache if distribution ID is provided
if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*"
    echo "✅ CloudFront cache invalidated!"
fi

echo "🎉 Deployment completed successfully!"
echo "Your app should be available at: https://$S3_BUCKET_NAME.s3-website-$(aws configure get region).amazonaws.com"