from datetime import datetime, timedelta, date
from rest_framework import permissions, mixins, status, viewsets
from ..models import Company, Payment, Ticket, Week
from ..serializers import TicketSerializer
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django.db.models import Q
from ..pagination import TicketPagination

today = date.today()
first_current_week_date = today - timedelta(days=today.weekday())
last_current_week_date = first_current_week_date + timedelta(days=6)

class TicketViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes  = [permissions.IsAuthenticated]
    serializer_class    = TicketSerializer
    pagination_class    = TicketPagination


    def get_queryset(self):

        range_filter = self.request.query_params.get('range', (first_current_week_date, last_current_week_date))
        if not range_filter:
            range_filter = (today, today)
            
        status = self.request.query_params.get('status', None)

        queryset = Ticket.objects.filter(created_at__range=range_filter)
        if status:
            queryset = queryset.filter(payment__status=status)
        
        if not self.request.user.is_superuser:
            queryset = queryset.filter(collaborator=self.request.user)

        return queryset.order_by('-created_at')
        

    def create(self, request):
        week = Week.objects.get_or_create(week_number=today.isocalendar().week, collaborator=request.user, )[0]

        payment_data = request.data.pop('payment', {})
        payment_data['type'] = payment_data.get('type', 'Efectivo')
        payment_data['status'] =  payment_data.get('status', '1')
        payment_data['collaborator'] = request.user
        payment_data['week'] = week
        payment = Payment.objects.create(**payment_data)

        request.data['payment']     = payment.id
        request.data['collaborator'] = request.user.id

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        payment.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def modify_payment(self, payment_details):
        if not payment_details: return
        payment = get_object_or_404(Payment, pk=payment_details["id"])
        payment.amount = payment_details.get('amount', payment.amount)
        payment.type = payment_details.get('type', payment.type)
        payment.status = payment_details.get('status', payment.status)
        payment.save()
   
    def update(self, request, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)

        payment_details = request.data.pop('payment', {})
        payment_details["id"] = ticket.payment.id
        
        self.modify_payment(payment_details)

        serializer = self.serializer_class(ticket, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    def retrieve(self, request, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)
        return Response(self.serializer_class(ticket).data, status=status.HTTP_200_OK)
    
    def destroy(self, request, pk=None):
        ticket = get_object_or_404(Ticket, pk=pk)
        ticket.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    