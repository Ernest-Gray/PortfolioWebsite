from app.rag.prompt import SYSTEM_PROMPT, build_messages


def test_build_messages_includes_context():
    chunks = [{"content": "Ernest built RAG at AWS", "source": "aws-work", "similarity": 0.9}]
    system, messages = build_messages("What did Ernest build?", chunks, [])
    assert "Ernest built RAG at AWS" in system
    assert "[Source: aws-work]" in system


def test_build_messages_appends_user_message():
    system, messages = build_messages("Tell me about Ernest", [], [])
    assert messages[-1] == {"role": "user", "content": "Tell me about Ernest"}


def test_build_messages_caps_history_at_10():
    history = [{"role": "user", "content": f"msg {i}"} for i in range(20)]
    system, messages = build_messages("new message", [], history)
    assert len(messages) == 11  # 10 history + 1 new user message


def test_system_includes_base_prompt():
    system, _ = build_messages("hi", [], [])
    assert SYSTEM_PROMPT[:50] in system


def test_multiple_chunks_in_context():
    chunks = [
        {"content": "AWS work", "source": "aws-work", "similarity": 0.9},
        {"content": "Northrop work", "source": "northrop-work", "similarity": 0.8},
    ]
    system, _ = build_messages("hi", chunks, [])
    assert "AWS work" in system
    assert "Northrop work" in system
    assert "[Source: northrop-work]" in system
