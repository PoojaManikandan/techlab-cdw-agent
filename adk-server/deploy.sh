#!/bin/bash

set -e  # ❗ Stop on any error

# ✅ Load config file
if [ ! -f "./azure.config" ]; then
  echo "❌ azure.config file not found!"
  exit 1
fi
source ./azure.config

echo "Logging in to Azure..."
az login --tenant "$TENANT_ID"

echo "Logging in to Azure Container Registry..."
az acr login -n "$ACR_NAME"

echo "Building and pushing Docker image to ACR..."
az acr build \
  --registry "$ACR_NAME" \
  --image "$IMAGE_NAME" \
  .

echo "Deploying Azure Container App..."
az containerapp create \
  --name "$CONTAINER_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --environment "$ENV_NAME" \
  --image "${ACR_NAME}.azurecr.io/${IMAGE_NAME}" \
  --registry-server "${ACR_NAME}.azurecr.io" \
  --registry-username "$REGISTRY_USERNAME" \
  --registry-password "$REGISTRY_PASSWORD" \
  --target-port "$TARGET_PORT" \
  --ingress external \
  --cpu "$CPU" \
  --memory "$MEMORY" \
  --min-replicas 1 \
  --max-replicas 2 \
  --env-vars \
    GOOGLE_GENAI_USE_VERTEXAI="$GOOGLE_GENAI_USE_VERTEXAI" \
    GOOGLE_API_KEY="$GOOGLE_API_KEY" \
    SERVER_URL="$SERVER_URL" \
    API_GATEWAY_URL="$API_GATEWAY_URL" \
    PAYPAL_CLIENT_ID="$PAYPAL_CLIENT_ID" \
    PAYPAL_SECRET="$PAYPAL_SECRET" \
    MONGODB_ATLAS_CLUSTER_URI="$MONGODB_ATLAS_CLUSTER_URI" \
    MONGODB_NAME="$MONGODB_NAME" \
    MONGODB_COLLECTION_NAME="$MONGODB_COLLECTION_NAME" \
    MONGODB_ATLAS_VECTOR_SEARCH_INDEX_NAME="$MONGODB_ATLAS_VECTOR_SEARCH_INDEX_NAME" \
    MONGODB_ATLAS_VECTOR_STORE_DIMENSIONS="$MONGODB_ATLAS_VECTOR_STORE_DIMENSIONS" \
    AZURE_OPENAI_ENDPOINT="$AZURE_OPENAI_ENDPOINT" \
    AZURE_OPENAI_API_KEY="$AZURE_OPENAI_API_KEY" \
    AZURE_OPENAI_TEXT_EMBEDDING_DEPLOYMENT_NAME="$AZURE_OPENAI_TEXT_EMBEDDING_DEPLOYMENT_NAME" \
    AZURE_OPENAI_API_VERSION="$AZURE_OPENAI_API_VERSION" \
    OPENAI_API_VERSION="$OPENAI_API_VERSION" \
    AZURE_API_KEY="$AZURE_API_KEY" \
    AZURE_API_BASE_URL="$AZURE_API_BASE_URL" \
    AZURE_API_VERSION="$AZURE_API_VERSION" \
    AZURE_OPENAI_GPT-4O_DEPLOYMENT_NAME="$AZURE_OPENAI_GPT-4O_DEPLOYMENT_NAME" 

echo "✅ Deployment completed successfully!"