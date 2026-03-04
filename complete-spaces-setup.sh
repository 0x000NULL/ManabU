#!/bin/bash

# Complete DigitalOcean Spaces Setup for Wakaru
# Run this AFTER manually creating the bucket via web console

set -e

BUCKET="wakaru-media"
REGION="sfo3"

echo "🚀 Completing Wakaru Spaces Setup"
echo "=================================="
echo ""

# Check if s3cmd is configured
if [ ! -f ~/.s3cfg ]; then
    echo "❌ Error: s3cmd not configured. Run the initial setup first."
    exit 1
fi

# Test bucket access
echo "📝 Testing bucket access..."
if s3cmd ls s3://$BUCKET/ > /dev/null 2>&1; then
    echo "✅ Bucket access confirmed"
else
    echo "❌ Error: Cannot access bucket '$BUCKET'"
    echo "   Make sure you:"
    echo "   1. Created the bucket via https://cloud.digitalocean.com/spaces"
    echo "   2. Granted the key (DO801H4DZJ6CQ2UDLAFK) access to the bucket"
    exit 1
fi

# Create folder structure
echo ""
echo "📁 Creating folder structure..."
SHOWS=("shirokuma-cafe" "takagi-san" "terrace-house" "death-note" "evangelion")

for show in "${SHOWS[@]}"; do
    echo "   Creating folders for $show..."
    echo "" | s3cmd put --acl-public - s3://$BUCKET/videos/$show/.keep 2>&1 | grep -v "WARNING" || true
    echo "" | s3cmd put --acl-public - s3://$BUCKET/subtitles/$show/.keep 2>&1 | grep -v "WARNING" || true
done

echo "✅ Folder structure created"

# Create and apply CORS configuration
echo ""
echo "🌐 Configuring CORS..."
cat > /tmp/wakaru-cors.xml << 'EOF'
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
EOF

if s3cmd setcors /tmp/wakaru-cors.xml s3://$BUCKET/ 2>&1 | grep -v "WARNING"; then
    echo "✅ CORS configured"
else
    echo "⚠️  CORS configuration may have failed (check manually)"
fi

rm /tmp/wakaru-cors.xml

# Set bucket ACL to public-read
echo ""
echo "🔓 Setting public read access..."
if s3cmd setacl s3://$BUCKET --acl-public 2>&1 | grep -v "WARNING"; then
    echo "✅ Public read access enabled"
else
    echo "⚠️  ACL setting may have failed (check manually)"
fi

# Test upload
echo ""
echo "🧪 Testing file upload..."
echo "Wakaru test file - $(date)" > /tmp/wakaru-test.txt

if s3cmd put --acl-public /tmp/wakaru-test.txt s3://$BUCKET/test.txt 2>&1 | grep -v "WARNING"; then
    echo "✅ Test upload successful"
    
    # Get the URL
    CDN_URL="https://$BUCKET.$REGION.cdn.digitaloceanspaces.com/test.txt"
    DIRECT_URL="https://$BUCKET.$REGION.digitaloceanspaces.com/test.txt"
    
    echo ""
    echo "📍 Test file URLs:"
    echo "   CDN: $CDN_URL"
    echo "   Direct: $DIRECT_URL"
    
    # Test access
    echo ""
    echo "🔍 Testing public access..."
    if curl -s -o /dev/null -w "%{http_code}" "$CDN_URL" | grep -q "200"; then
        echo "✅ File is publicly accessible via CDN"
    else
        echo "⚠️  CDN access test inconclusive (may need time to propagate)"
    fi
    
    # Clean up test file
    echo ""
    read -p "Delete test file? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        s3cmd del s3://$BUCKET/test.txt 2>&1 | grep -v "WARNING"
        echo "✅ Test file deleted"
    fi
else
    echo "❌ Test upload failed"
fi

rm -f /tmp/wakaru-test.txt

# Display info
echo ""
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "📦 Bucket: $BUCKET"
echo "📍 Region: $REGION"
echo "🌐 CDN Base URL: https://$BUCKET.$REGION.cdn.digitaloceanspaces.com"
echo "🔗 Direct Base URL: https://$BUCKET.$REGION.digitaloceanspaces.com"
echo ""
echo "📂 Folder structure:"
s3cmd ls -r s3://$BUCKET/ 2>&1 | grep -v "WARNING" | head -20 || echo "   (folders created - may not show in ls)"
echo ""
echo "📖 Upload examples:"
echo "   s3cmd put --acl-public video.mp4 s3://$BUCKET/videos/show-name/"
echo "   s3cmd put --acl-public subs.vtt s3://$BUCKET/subtitles/show-name/"
echo ""
echo "📄 Full documentation: ~/.openclaw/workspace/Wakaru/DO_SPACES_SETUP.md"
