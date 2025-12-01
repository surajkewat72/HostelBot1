#!/bin/bash

echo "========================================="
echo "Testing HostelBot Authentication"
echo "========================================="
echo ""

# Test 1: Login with existing user
echo "Test 1: Login with existing user (suraj@gmail.com)"
echo "-------------------------------------------"
response=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suraj@gmail.com","password":"123456"}')

if echo "$response" | grep -q "token"; then
  echo "✅ Login successful!"
  echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
else
  echo "❌ Login failed!"
  echo "Response: $response"
fi
echo ""

# Test 2: Login with incorrect password
echo "Test 2: Login with incorrect password"
echo "-------------------------------------------"
response=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"suraj@gmail.com","password":"wrongpassword"}')

if echo "$response" | grep -q "error"; then
  echo "✅ Correctly rejected invalid credentials"
  echo "Response: $response"
else
  echo "❌ Should have rejected invalid credentials"
  echo "Response: $response"
fi
echo ""

# Test 3: Signup new user
echo "Test 3: Signup new user"
echo "-------------------------------------------"
timestamp=$(date +%s)
test_email="test${timestamp}@example.com"

response=$(curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$test_email\",\"password\":\"123456\",\"room\":\"101\",\"block\":\"A\"}")

if echo "$response" | grep -q "token"; then
  echo "✅ Signup successful!"
  echo "Response: $response" | jq '.' 2>/dev/null || echo "$response"
else
  echo "❌ Signup failed!"
  echo "Response: $response"
fi
echo ""

# Test 4: Signup with existing email
echo "Test 4: Signup with existing email"
echo "-------------------------------------------"
response=$(curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"suraj@gmail.com","password":"123456","room":"101","block":"A"}')

if echo "$response" | grep -q "error"; then
  echo "✅ Correctly rejected duplicate email"
  echo "Response: $response"
else
  echo "❌ Should have rejected duplicate email"
  echo "Response: $response"
fi
echo ""

echo "========================================="
echo "Testing complete!"
echo "========================================="
