import os, requests
from dotenv import load_dotenv

load_dotenv()

from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient

import models


def get_vector_store():
    """
    Gets a MongoDB Atlas vector store for product embeddings.
    If vector search index does not exist, it will create one.
    This function initializes the MongoDB client, sets up the vector store,
    and checks for the existence of the vector search index.
    """

    # initialize MongoDB python client
    client = MongoClient(os.getenv("MONGODB_ATLAS_CLUSTER_URI"))
    MONGODB_COLLECTION = client[os.getenv("MONGODB_NAME")][os.getenv("MONGODB_COLLECTION_NAME")]
    
    embeddings = models.create_text_embedding_model()

    vector_store = MongoDBAtlasVectorSearch(
        collection=MONGODB_COLLECTION,
        embedding=embeddings,
        index_name=os.getenv("MONGODB_ATLAS_VECTOR_SEARCH_INDEX_NAME"),
        relevance_score_fn="cosine",
    )

    # Check if the vector search index already exists
    existing_search_indexes = list(MONGODB_COLLECTION.list_search_indexes())
    index_exists = any(idx["name"] == os.getenv("MONGODB_ATLAS_VECTOR_SEARCH_INDEX_NAME") for idx in existing_search_indexes)

    # Create the vector search index if it doesn't exist
    if index_exists:
        print("Vector Search index already exists.\n")
    else:
        dimensions = int(os.getenv("MONGODB_ATLAS_VECTOR_STORE_DIMENSION"))
        vector_store.create_vector_search_index(dimensions=dimensions)
        print("Vector Search index created.\n")

    return vector_store



def get_relevant_results(query: str, number_of_results: int = 1):
    """
    This vector search function to search and retrieve relevant documents from the vector store.
    This function performs a similarity search and returns the results.
    """

    vector_store = get_vector_store()

    results = vector_store.similarity_search_with_score(query, k=number_of_results)
    for res, score in results:
        print(f"* [SIM={score:3f}] {res.page_content} [{res.metadata}]")

    return results
