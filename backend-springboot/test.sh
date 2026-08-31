#!/bin/bash

echo "========================================="
echo "Testing UniFlow API on port 8081"
echo "========================================="

echo -e "\n1. Health Check:"
curl -s http://localhost:8081/api/health

echo -e "\n\n2. Get All Offices:"
curl -s http://localhost:8081/api/offices

echo -e "\n\n3. Register New User:"
curl -s -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "matriculationNumber": "UNI/2026/004",
    "email": "scriptuser@uniflow.com",
    "password": "password123",
    "fullName": "Script User",
    "phone": "08044445555"
  }'

echo -e "\n\n4. Login:"
curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "scriptuser@uniflow.com",
    "password": "password123"
  }'

echo -e "\n\n========================================="
echo "Done!"