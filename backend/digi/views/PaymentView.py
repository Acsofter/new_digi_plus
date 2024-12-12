from django.shortcuts import get_object_or_404
from ..pagination import PaymentPagination
from ..models import Payment, Week
from ..serializers import PaymentSerializerWithTicketDetails
from rest_framework import permissions, mixins, viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import serializers
from django.db.models import Q



class PaymentViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PaymentSerializerWithTicketDetails
    pagination_class = PaymentPagination

    def get_queryset(self):
        filter_user = self.request.query_params.get('collaborator', None)
        filter_week = self.request.query_params.get('week', None)
        if self.request.user.is_staff:
            queryset = Payment.objects.filter(Q(week__week_number=int(filter_week)))
            if filter_user:
                queryset = queryset.filter(collaborator=int(filter_user))
        else:
            queryset = Payment.objects.filter(collaborator=self.request.user)
        return queryset.order_by('-created_at')    

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate_payment(self, request):
        data = {
            "week_number": request.data.get('week'),
            "collaborator": request.data.get('collaborator'),
        }

        if not data.get("week_number"):
            raise serializers.ValidationError('week number are required')
        week = Week.objects.get(**data)
        if not week:
            raise serializers.ValidationError('week not found')
        try:

            week.generate_payments()
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
        return Response({'message': 'payments generated for collaborator {}'.format(week.collaborator.username)}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def generate_payment_for_all(self, request):
        week_number = request.data.get('week', None)
        if not week_number:
            raise serializers.ValidationError('week number are required')
        week = Week.objects.filter(week_number=week_number)
        if not week:
            raise serializers.ValidationError('week not found')
        
        try:
            for w in week:
                w.generate_payments()
        except Exception as e:
            raise serializers.ValidationError(str(e))
        
        return Response({'message': 'payments generated'}, status=status.HTTP_200_OK)
    
    def retrieve(self, request, pk=None):
        payment = get_object_or_404(Payment, pk=pk)
        return Response(self.serializer_class(payment).data, status=status.HTTP_200_OK)

    

    

    


