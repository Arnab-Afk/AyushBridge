#!/bin/bash

# Start the AyushBridge Chatbot in the background
echo "Starting AyushBridge Chatbot..."
cd AyushBridge_Chatbot && python run_chatbot.py &
CHATBOT_PID=$!
echo "Chatbot started with PID: $CHATBOT_PID"

# Wait for the chatbot to initialize
sleep 5
echo "Chatbot server should be running at http://localhost:5000"

# Start Next.js development server
echo "Starting Next.js development server..."
npm run dev

# When Next.js is terminated, also kill the chatbot process
trap "kill $CHATBOT_PID" EXIT
