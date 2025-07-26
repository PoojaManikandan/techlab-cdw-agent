#!/bin/bash

set -e  # ❗ Stop on any error

# ✅ Load config file
if [ ! -f "./azure.config" ]; then
  echo "❌ azure.config file not found!"
  exit 1
fi
source ./azure.config

echo " Logging in to Azure..."
az login --tenant "$TENANT_ID"

echo " Logging in to Azure Container Registry..."
az acr login -n "$ACR_NAME"

echo "🔧 Building and pushing Docker image to ACR..."
az acr build \
  --registry "$ACR_NAME" \
  --image "$IMAGE_NAME" \
  .

echo " Deploying Azure Container App..."
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
  --max-replicas 1 \
  --env-vars \
    ADK_SERVER_URL="$ADK_SERVER_URL" \
    PRODUCT_SERVER_URL="$PRODUCT_SERVER_URL" \
    ADK_APP_NAME="$ADK_APP_NAME" \
    MONGODB_URL="$MONGODB_URL" \
    FRONTEND_ORIGIN="$FRONTEND_ORIGIN"

echo "✅ Deployment completed successfully!"