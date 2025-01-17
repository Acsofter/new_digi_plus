from django.shortcuts import get_object_or_404
from ..pagination import PaymentPagination
from ..models import Payment, Week
from ..serializers import PaymentSerializerWithTicketDetails, WeekSerializer
from rest_framework import permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import serializers
from django.db.models import Q
from datetime import date

today = date.today()

class PaymentViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PaymentSerializerWithTicketDetails
    pagination_class = PaymentPagination

    def get_queryset(self):
        filter_user = self.request.query_params.get('collaborator')
        filter_week = self.request.query_params.get('week', today.isocalendar().week)
        filter_year = self.request.query_params.get('year', today.isocalendar().year)

        if self.request.user.is_staff:
            queryset = Payment.objects.filter(Q(week__week_number=filter_week) & Q(week__year_number=filter_year))
            if filter_user:
                queryset = queryset.filter(collaborator=filter_user)
        else:
            queryset = Payment.objects.filter(collaborator=self.request.user, week__week_number=filter_week, week__year_number=filter_year)
        return queryset.order_by('-created_at')    

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate_payment(self, request):
        try:
            data = {
                "week_number": request.data.get('week', today.isocalendar().week),
                "year_number": request.data.get('year', today.isocalendar().year),
                "collaborator": request.data.get('collaborator'),
            }

            week = Week.objects.get(**data)

            if not week:
                raise serializers.ValidationError('week not found')
            try:


                week.generate_payments()
            except Exception as e:
                print(e)
                raise serializers.ValidationError(str(e))
            
            return Response({'message': WeekSerializer(week).data}, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate_payment_for_all(self, request):
        data = {
            "week_number": request.data.get('week', today.isocalendar().week),
            "year_number": request.data.get('year', today.isocalendar().year),
        }
        
        week = Week.objects.filter(**data)
        if not week:
            raise serializers.ValidationError('week not found')
        week.generate_payments()
        return Response({'message': 'payments generated'}, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        payment = get_object_or_404(Payment, pk=pk)
        return Response(self.serializer_class(payment).data, status=status.HTTP_200_OK)

    

    

    


