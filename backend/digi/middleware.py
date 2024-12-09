import traceback
import jwt
from django.conf import settings
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from channels.auth import AuthMiddlewareStack, AuthMiddleware

@database_sync_to_async
def get_user_from_id(data: dict):
    if data and 'username' in data and 'id' in data:
        from .models import User
        try:
            user_found = User.objects.get(username=data['username'], id=data['id'])
            from .serializers import UserSerializer

            if user_found:
                return UserSerializer(user_found).data
            return  False
        except User.DoesNotExist:
            return False
    return False

class JWTAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            if not scope or not isinstance(scope, dict):
                raise ValueError("Invalid scope")
            query_string = scope.get('query_string')
            if not query_string:
                raise ValueError("No query string in scope", scope)

            # Verificar si el token esté presente
            try:
                _, token = (query_string.decode()).split('=')
                if not token:
                    raise ValueError("No token in query string")
            except ValueError as e:
                raise ValueError("Invalid query string format") from e

            # Decodificar el token JWT
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError) as e:
                raise ValueError("Invalid token") from e

            user = await get_user_from_id(payload)
            if not user:
                raise ValueError("User not found")

            scope['user'] = user
            return await self.inner(scope, receive, send)

        except Exception as e:
            tb_info = traceback.format_tb(e.__traceback__)
            tb_line = tb_info[-1]
            tb_error = tb_line.split(')')[0]
            tb_details = tb_error.split(',')

            print("Error in JWTAuthMiddleware: ", e, tb_details)

            # Enviar un error de respuesta si es necesario
            await send({
                'type': 'http.response',
                'status': 401,
                'body': b'Unauthorized',
            })
            return



def JWTAuthMiddlewareStack(app):
    return CookieMiddleware(SessionMiddleware(JWTAuthMiddleware(app)))
