import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import notifications.routing
import search.routing as search_routing
import chatAndMessages.routing as chat_routing
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

django.setup()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            notifications.routing.websocket_urlpatterns + search_routing.websocket_urlpatterns + chat_routing.websocket_urlpatterns
        )
    ),
})
