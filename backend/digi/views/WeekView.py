from django.shortcuts import get_object_or_404
from ..models import Week
from ..serializers import WeekSerializer
from rest_framework import permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Q
from rest_framework import serializers
from .CustomAPIView import CustomAPIView
from datetime import date

today = date.today()

class WeekViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, CustomAPIView):
    permission_classes = {'get': [permissions.IsAuthenticated], 'put': [permissions.IsAdminUser], 'delete': [permissions.IsAdminUser]}
    serializer_class = WeekSerializer
    queryset = Week.objects.all()


    def retrieve(self, request, pk=None):

        collaborator = request.data.get('collaborator')
        if collaborator:
            week = get_object_or_404(queryset, week_number=pk, year_number=today.isocalendar().year, collaborator=request.user)
        else:
            week = get_object_or_404(queryset, week_number=pk, year_number=today.isocalendar().year)
     
    


