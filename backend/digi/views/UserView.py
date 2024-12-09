from rest_framework import permissions, mixins, status
from ..models import User
from ..serializers import UserSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from .CustomAPIView import CustomAPIView


class UserViewSet(mixins.UpdateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, CustomAPIView):
    serializer_class = UserSerializer
    permission_classes = {'get': [permissions.IsAuthenticated], 'post': [permissions.IsAdminUser], 'put': [permissions.IsAdminUser], 'delete': [permissions.IsAdminUser]}


    def get_queryset(self):
        if self.request.GET.get("includeAdmins") == "true":
            queryset = User.objects.all()
        else:
            queryset = User.objects.filter(is_staff=False, is_superuser=False)
        return queryset

    def list(self, request):
        serializer = self.serializer_class(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

    def update(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        serializer = self.serializer_class(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    # def destroy(self, request, pk=None):
    #     user = get_object_or_404(User, pk=pk)
    #     user.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
    
    def retrieve(self, request, pk=None):
        user = get_object_or_404(User, pk=pk)
        return Response(self.serializer_class(user).data, status=status.HTTP_200_OK)
    
    

        

    




