from rest_framework.viewsets import ViewSetMixin
from rest_framework import generics

class CustomAPIView(ViewSetMixin, generics.GenericAPIView):

    def get_permissions(self):
        if not self.permission_classes:
            return {}
        
        
        return {
            key: [permission() for permission in permissions]
            for key, permissions in self.permission_classes.items()
            if permissions
        }


    def check_permissions(self, request):
        if not request or not request.method:
            return

        method = request.method.lower()

        permissions = self.get_permissions()
        if not permissions:
            return 

        methods_permissions = permissions.get(method)
        if not methods_permissions:
             return
        
        for permission in methods_permissions:
            if not permission or not permission.has_permission(request, self):
                message = getattr(permission, 'message', None)
                self.permission_denied(request, message=message)
                return

