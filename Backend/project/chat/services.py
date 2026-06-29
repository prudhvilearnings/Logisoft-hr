from .models import ChatSession, ChatMessage
from django.core.exceptions import PermissionDenied

def get_mock_ai_response(user_message: str) -> str:
    """
    Mocked AI agent response. In the future, this can be integrated
    with a RAG pipeline, LLM client, or external AI model API.
    """
    return (
        f"This is a placeholder response from the AI Chatbot.\n"
        f"Received your message: '{user_message}'.\n"
        f"Ready for RAG or LLM integration in `chat/services.py`."
    )


def create_or_get_session(user, session_id=None, title=None) -> ChatSession:
    """
    Fetches an existing session owned by the user, or creates a new one.
    """
    if session_id:
        try:
            session = ChatSession.objects.get(id=session_id)
            # Ensure the user owns this session to append messages
            if session.user != user:
                raise PermissionDenied("You do not have access to this chat session.")
            return session
        except ChatSession.DoesNotExist:
            raise ValueError("Session with this ID does not exist.")
    
    # Create new session
    session_title = title if title else "Chat Session with AI"
    session = ChatSession.objects.create(user=user, title=session_title)
    return session


def save_message(session, sender, content) -> ChatMessage:
    """
    Saves a message to the database for the given session.
    """
    return ChatMessage.objects.create(
        session=session,
        sender=sender,
        content=content
    )
