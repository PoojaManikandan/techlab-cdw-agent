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

echo " Building and pushing Docker image to ACR..."
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
    REACT_APP_PAYPAL_CLIENT_ID="$REACT_APP_PAYPAL_CLIENT_ID" \
    REACT_APP_PRODUCT_SERVER_URL="$REACT_APP_PRODUCT_SERVER_URL" \
    REACT_APP_ADK_SERVER_URL="$REACT_APP_ADK_SERVER_URL" \

echo "✅ Deployment completed successfully!"