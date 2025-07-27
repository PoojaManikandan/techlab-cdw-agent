import os, requests
from dotenv import load_dotenv

load_dotenv()

from langchain_mongodb import MongoDBAtlasVectorSearch
from pymongo import MongoClient

from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document

import models, prompts


def create_vector_store():
    """
    Create and return a MongoDB Atlas vector store for product embeddings.
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
        print("Vector Search index already exists.")
    else:
        dimensions = int(os.getenv("MONGODB_ATLAS_VECTOR_STORE_DIMENSION"))
        vector_store.create_vector_search_index(dimensions=dimensions)
        print("Vector Search index created.")

    return vector_store


def fetch_all_products():
    """
    Fetch all products from the local product service.
    Returns a list of products or an error message if the request fails.
    """

    try:
        response = requests.get(os.getenv("SERVER_URL") + "/products")
        if response.status_code == 200:
            return response.json()
        else:
            return {"error": f"Failed to fetch products. Status code: {response.status_code}"}
    except Exception as e:
        return {"error": f"Exception occurred: {str(e)}"}


def products_summarizer():
    """
    Summarize product details using the LLM and the defined prompt.
    This function fetches all products, generates summaries for each product,
    and returns a list of summaries.
    """

    product_summaries = []
    llm = models.create_llm_model()
    prompt = prompts.PRODUCT_SUMMARIZER_PROMPT

    # Instantiate chain
    chain = create_stuff_documents_chain(llm, prompt)

    products = fetch_all_products()
    if "error" in products:
        print(products["error"])
        return
    
    for product in products:
        if "error" in product:
            return

        # Wrap product in a Document object
        docs = [Document(page_content=str(product))]

        # Invoke chain
        summary = chain.invoke({"context": docs})

        product_summaries.append({
            "summary": summary,
            "cdw": product.get("cdw", "")
        })
        print(f"Product CDW: {product.get('cdw', '')}, Summary: {summary}\n")

    return product_summaries


def add_items_to_vector_store(product_summaries, vector_store):
    """
    Add summarized product details to the vector store.
    This function creates Document objects for each product summary
    and adds them to the vector store with their corresponding CDW.
    """

    documents = []
    list_of_cdw = []
    for product_summary in product_summaries:
        document = Document(
            page_content=product_summary["summary"],
            metadata={
                "summary": product_summary["summary"], 
                "cdw": product_summary["cdw"]
            }
        )
        documents.append(document)
        list_of_cdw.append(product_summary["cdw"])
        print(f"Adding product CDW: {product_summary['cdw']} to vector store.\n")

    vector_store.add_documents(documents=documents, ids=list_of_cdw)


def create_and_populate_vector_store():
    """
    Main function to create the vector store, summarize products,
    and add them to the vector store.
    This function is intended to be called as the entry point for the data pipeline.
    """

    vector_store = create_vector_store()
    product_summaries = products_summarizer()
    
    if not product_summaries:
        print("No product summaries generated.")
    else:
        add_items_to_vector_store(product_summaries, vector_store)
        print("Product summaries added to vector store.")

    return vector_store


def sample_vector_store_search():
    """
    Sample function to demonstrate a search in the vector store.
    This function performs a similarity search and prints the results.
    """

    vector_store = create_vector_store()

    results = vector_store.similarity_search_with_score("tell me a product that would be shipped within 6 hours", k=1)
    print("Search results length: ", len(results))
    for res, score in results:
        print(f"* [SIM={score:3f}] {res.page_content} [{res.metadata}]")


if __name__ == "__main__":
    """
    Main entry point for the data_pipline script.
    """
    create_and_populate_vector_store()

