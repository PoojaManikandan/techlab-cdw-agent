# Techlab CDW Agent

## Overview
Techlab CDW Agent is a full-stack e-commerce assistant platform featuring:
- AI-powered product, quote, and order management
- React-based client UI
- FastAPI-powered API gateway and backend microservices
- MongoDB for data storage

## Project Structure
```
adk-server/         # AI agent backend (Python, FastAPI, Google ADK)
client/             # Frontend (React)
server/             # Product/order backend (Python, FastAPI)
api-gateway/        # API Gateway (Python, FastAPI)
UX/                 # UX assets/screenshots
```

## Setup

### Prerequisites
- Python 3.13+
- Node.js 18+
- MongoDB credentials
- Google ADK credentials

### Backend

1. **Install Python dependencies:**
   ```bash
   cd adk-server
   pip install -r requirements.txt
   cd ../server
   pip install -r requirements.txt
   cd ../api-gateway
   pip install -r requirements.txt
   ```

2. **Start MongoDB** (local or cloud).

3. **Run servers:**
   ```bash
   # In separate terminals
   cd adk-server && uvicorn main:app --reload --port 8000
   cd server && uvicorn app:app --reload --port 8080
   cd api-gateway && uvicorn main:app --reload --port 8011
   ```

### Frontend

1. **Install dependencies:**
   ```bash
   cd client
   npm install
   ```

2. **Start React app:**
   ```bash
   npm start
   ```

## Usage

- Access the frontend at `http://localhost:3000`
- API Gateway at `http://localhost:8011`
- Product/Order backend at `http://localhost:8080`
- AI agent backend at `http://localhost:8000` 

## Features

- Product listing, details, and search
- Cart and checkout flows
- Quote creation and management
- PayPal sandbox integration
- AI chatbot for user assistance

## Environment Variables

Set up `.env` files in each backend folder with:
```
MONGODB_URL=your_mongo_url
PRODUCT_SERVER_URL=http://localhost:8080
ADK_SERVER_URL=http://localhost:8001
FRONTEND_ORIGIN=http://localhost:3000
ADK_APP_NAME=cdw_agent
```
