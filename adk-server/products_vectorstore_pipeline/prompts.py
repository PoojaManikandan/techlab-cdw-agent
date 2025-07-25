from langchain_core.prompts import ChatPromptTemplate

PRODUCT_SUMMARIZER_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant that summarizes product details. This summary will be used to generate embeddings for the product which later will be used to answer user queries about the product and search results for the product."),
        ("user", "When I provide you with all details of a product, summarize the product in 2 to 3 lines, ensuring you include all relevant details. Product data: {context}"),
    ]
)
