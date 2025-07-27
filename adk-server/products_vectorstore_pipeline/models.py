import os
from dotenv import load_dotenv

load_dotenv()

from langchain_openai import AzureOpenAIEmbeddings, AzureChatOpenAI


def create_text_embedding_model():
    """
    Create and return a text embedding model using Azure OpenAI.
    """
    return AzureOpenAIEmbeddings(
        azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
        azure_deployment=os.getenv("AZURE_OPENAI_TEXT_EMBEDDING_DEPLOYMENT_NAME"),
        openai_api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
        api_key=os.getenv("AZURE_OPENAI_API_APIKEY"),
    )


def create_llm_model(deployment_name=os.getenv("AZURE_OPENAI_GPT_4O_DEPLOYMENT_NAME")):
    """
    Create and return a language model using Azure OpenAI.
    """

    return AzureChatOpenAI(
        deployment_name=deployment_name
    )
