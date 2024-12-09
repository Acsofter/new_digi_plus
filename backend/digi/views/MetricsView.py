from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions, status
from ..models import Payment, Ticket, User
from rest_framework.response import Response
from ..serializers import MetricsSerializer
from django.db.models import Q
from datetime import timedelta, date
from rest_framework.decorators import action
from django.db.models import Avg, Sum, Count
from django.db.models.functions import ExtractWeek, ExtractYear
from django.utils import timezone


today = date.today()
first_current_week_date = today - timedelta(days=today.weekday())
last_current_week_date = first_current_week_date + timedelta(days=6)

class MetricsViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    serializer_class = MetricsSerializer

    

    def get_queryset(self):
        range_filter = self.request.query_params.get('range', (first_current_week_date, last_current_week_date))
        
        queryset = Ticket.objects.filter(created_at__range=range_filter)


        if not self.request.user.is_superuser:
            queryset = queryset.filter(collaborator=self.request.user)


        return queryset

    def filter_tickets(self):
        total_today = self.get_queryset().filter(created_at__gte=today)
        
        first_month_date = today.replace(day=1)
        last_month_date =  today.replace(month=today.month+1, day=1) - timedelta(days=1)
        # total_yesterday = tickets_data.filter(created_at__gte=today - timedelta(days=1)).select_related('payment')        
        # total_past_week = tickets_data.filter(
        #                                     Q(created_at__lt=first_current_week_date - timedelta(days=7)) &
        #                                     Q(created_at__gte=last_current_week_date - timedelta(days=6)))
        
        total_month = Ticket.objects.filter(created_at__range=(first_month_date, last_month_date)) 
    
        return {
            "today": total_today,
            "week": self.get_queryset(),
            "month": total_month,
        }


    def list(self, request):
        data = self.filter_tickets()
        serializer = self.serializer_class(data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def line(self, request):
        users = User.objects.filter(is_staff=False, is_superuser=False) if request.user.is_staff else [request.user]
        data = {}

        for i in range(7):
            try:
                date_to_filter = first_current_week_date + timedelta(days=i)
                for user in users:

                    tickets = Ticket.objects.filter(created_at__date=date_to_filter.strftime("%Y-%m-%d"), collaborator=user)
                    if user.username in data:
                        data[user.username]["data"].append(sum([tickets.payment.amount for tickets in tickets]))
                    else:
                        data[user.username] = {"label": user.username, "data": [sum([tickets.payment.amount for tickets in tickets])], "borderColor": user.color or "hsl(0, 0%, 0%)", "backgroundColor": user.color or "hsl(0, 0%, 0%)", "fill": False, "tension": 0.3}
            except Exception as e:
                print(e)
                data.append(0)

        return Response(data.values(), status=status.HTTP_200_OK)

    def get_total_payments_by_week(self):
        today = timezone.now().date()
        current_week_number = today.isocalendar()[1]
      

        payments_by_week = Payment.objects.filter(collaborator=self.request.user).annotate(
            week=ExtractWeek('created_at'),
            year=ExtractYear('created_at')
        )

        payments_by_week_excude_current_week = payments_by_week.exclude(week=current_week_number)
        payments_average = payments_by_week_excude_current_week.aggregate(average=Avg('amount'))['average']


        total_by_week = payments_by_week.values('week', 'year').annotate(total=Sum('amount'))
        total_by_week = {entry['week']: entry['total'] for entry in total_by_week}

        return {
            'total_by_week': total_by_week,
            'percentage_current_week': ((total_by_week[current_week_number] / 
                                         payments_by_week_excude_current_week.aggregate(average=Sum('amount'))['average']) * 100) 
                                         if total_by_week.get(current_week_number, None) else 0,
            'average': payments_average,
            'weeks_range': (1, current_week_number),
        }

    def get_total_tickets_by_week(self):
        today = timezone.now().date()
        current_week_number = today.isocalendar()[1]
        total_by_week = Ticket.objects.filter(collaborator=self.request.user).annotate(
            week=ExtractWeek('created_at'),
            year=ExtractYear('created_at')
        ).values('week', 'year').annotate(total=Count('id'))

        average_excluding_current_week = total_by_week.exclude(week=current_week_number).aggregate(average=Avg('total'))['average']

        total_by_week = {entry['week']: entry['total'] for entry in total_by_week}


        return {
            'total_by_week': total_by_week,
            'weeks_range': (1, current_week_number),  
            'average': average_excluding_current_week         
            # 'percentage_current_week': ((total_by_week[current_week_number] / total_by_week.get(current_week_number, 0)) * 100) if total_by_week.get(current_week_number, None) else 0,
        }

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def percentages(self, request):
        result = self.get_total_payments_by_week()
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def tickets(self, request):
        result = self.get_total_tickets_by_week()
        return Response(result, status=status.HTTP_200_OK)
        

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        tickets_data = Ticket.objects.filter(collaborator=request.user.id)
        return Response(self.serializer_class(self.filter_tickets(tickets_data)).data, status=status.HTTP_200_OK)
    

    def retrieve(self, request, pk=None):
        if not pk: return Response({"message": "Especifique un colaborador"}, status=status.HTTP_404_NOT_FOUND)
        collaborator = get_object_or_404(User, pk=pk)
        tickes_data = Ticket.objects.filter(collaborator=pk)
        serializer = self.serializer_class(self.filter_tickets(tickes_data))
        return Response(serializer.data, status=status.HTTP_200_OK)


   







