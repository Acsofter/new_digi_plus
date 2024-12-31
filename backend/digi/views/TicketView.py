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
        week = Week.objects.get_or_create(week_number=today.isocalendar().week, year_number=today.isocalendar().year, collaborator=request.user)[0]

        payment_data = request.data.pop('payment', {})
        if not payment_data.get('amount'): return Response({"amount": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
        payment_details = {
            'type': payment_data.get('type', 'Efectivo'),
            'amount': payment_data.get('amount'),
            'status': 1,
            'collaborator': request.user,
            'week': week,
        }
     
        payment = Payment.objects.create(**payment_details)
               
        serializer = self.serializer_class(data={
            **request.data,
            'payment': payment.id,
            'collaborator': request.user.id
        })

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        payment.delete()
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def modify_payment(self, id, status):
    
        if not status: return
        payment = get_object_or_404(Payment, id=id)

        # if status is 1(pending) staff can approve or reject
        # if status is 2(approved) or 3(rejected) staff cant change the status
        if int(payment.status) == 1 and int(status) != int(payment.status):
            payment.status = status
            payment.save()

        # payment.amount = payment_details.get('amount', payment.amount)
        # payment.type = payment_details.get('type', payment.type)
        return payment
   
    def update(self, request, pk=None):
        if not self.request.user.is_staff: return Response({"status": ["You dont have permission to modify this ticket"]}, status=status.HTTP_403_FORBIDDEN)
        
        ticket = get_object_or_404(Ticket, pk=pk)

        payment_data = request.data.get('payment', {})
        status_req = payment_data.get('status')  
        del request.data['payment']
        
        if not status_req:
            return Response({"status": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

        self.modify_payment(ticket.payment.id, status_req)

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
    
    