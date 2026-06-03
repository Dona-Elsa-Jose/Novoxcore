import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from qdrant_client import QdrantClient
from backend.embedding import get_embedding

COLLECTION_NAME = "novoxcore"

client = QdrantClient(
    host="localhost",
    port=6333
)

MIN_SCORE = 0.40


def retrieve_context(
    query: str,
    k: int = 3
):
    # Query rewriting for company overview questions
    query_lower = query.lower()

    if any(keyword in query_lower for keyword in [
    "what is novoxcore",
    "tell me about novoxcore",
    "tell about novoxcore",
    "about novoxcore",
    "about us",
    "who are you",
    "company overview",
    "about company",
    "about the company",
    "tell me about your company"
]):
     query = (
        "novoxcore company overview "
        "digital product agency "
        "ai powered branding "
        "ui ux design "
        "web development "
        "mobile development "
        "intelligent automation"
    )

    query_vector = get_embedding(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=k
    ).points

    contexts = []

    for result in results:

        if result.score >= MIN_SCORE:

            contexts.append(
                result.payload["text"]
            )

    return contexts