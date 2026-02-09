#!/bin/bash

echo "=== Testing API Endpoints ==="

# Test 1: Auth Login (get token)
echo ""
echo "1. Testing auth login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careertodo.com","password":"Password123!"}')

echo "$LOGIN_RESPONSE" | head -c 500

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4 | head -1)

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed, no token received"
else
  echo "✅ Login successful, token received"
  
  # Test 2: Get projects
  echo ""
  echo "2. Testing /api/projects..."
  curl -s -X GET "http://localhost:3000/api/projects?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
  
  # Test 3: Get tasks
  echo ""
  echo "3. Testing /api/tasks..."
  curl -s -X GET "http://localhost:3000/api/tasks?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
  
  # Test 4: Get admin stats
  echo ""
  echo "4. Testing /api/admin/stats..."
  curl -s -X GET "http://localhost:3000/api/admin/stats?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
  
  # Test 5: Get project approvals
  echo ""
  echo "5. Testing /api/admin/approvals/projects..."
  curl -s -X GET "http://localhost:3000/api/admin/approvals/projects?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
    
  # Test 6: Get work sessions
  echo ""
  echo "6. Testing /api/work-sessions..."
  curl -s -X GET "http://localhost:3000/api/work-sessions?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
    
  # Test 7: Get time entries
  echo ""
  echo "7. Testing /api/time-entries..."
  curl -s -X GET "http://localhost:3000/api/time-entries?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" | head -c 1000
    
  # Test 8: Create a task with multiple assignees
  echo ""
  echo "8. Testing task creation with assignees..."
  curl -s -X POST "http://localhost:3000/api/tasks?XTransformPort=3000" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Test Task with Multiple Assignees",
      "description": "Testing the taskAssignee system",
      "projectId": null,
      "priority": "HIGH",
      "status": "TODO",
      "assigneeIds": []
    }' | head -c 1000
    
fi

echo ""
echo "=== API Tests Complete ==="
