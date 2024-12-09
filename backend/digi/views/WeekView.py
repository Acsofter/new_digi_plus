from django.shortcuts import get_object_or_404
from ..models import Week
from ..serializers import WeekSerializer
from rest_framework import permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework import serializers
from .CustomAPIView import CustomAPIView

class WeekViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, CustomAPIView):
    permission_classes = {'get': [permissions.IsAuthenticated], 'put': [permissions.IsAdminUser], 'delete': [permissions.IsAdminUser]}
    serializer_class = WeekSerializer
    queryset = Week.objects.all()


    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        week = get_object_or_404(queryset, week_number=pk)
        serializer = WeekSerializer(week)
        return Response(serializer.data)

    


