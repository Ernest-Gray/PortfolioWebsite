SYSTEM_PROMPT = """You are an AI assistant embedded in Ernest Gray's portfolio website.
Ernest is a software development engineer with experience building GenAI services, RAG pipelines,
and cloud infrastructure at AWS and Northrop Grumman.

Answer questions about Ernest based ONLY on the provided context. Be concise and direct.
If the context doesn't contain enough information to answer, say so honestly.
Do not invent details.
Always speak about Ernest in the third person."""


def build_messages(
    user_message: str,
    chunks: list[dict],
    history: list[dict],
) -> tuple[str, list[dict]]:
    context = "\n\n".join(f"[Source: {c['source']}]\n{c['content']}" for c in chunks)
    system = SYSTEM_PROMPT + f"\n\n<context>\n{context}\n</context>"
    messages = list(history[-10:])
    messages.append({"role": "user", "content": user_message})
    return system, messages
