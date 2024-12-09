from django.http import HttpResponse
from rest_framework.response import Response
from django.template.loader import render_to_string
import xhtml2pdf.pisa as pisa
from io import BytesIO
from rest_framework import viewsets, permissions, status, serializers
from ..serializers import  PaymentSerializerWithTicketDetails, CompanySerializer
from ..models import Company, Payment
from decimal import Decimal


class ReportViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated] # cambiar a adminuser
    serializer_class = PaymentSerializerWithTicketDetails

    def get_queryset(self):
        user = self.request.query_params.get('user', None)
        payments = Payment.objects.filter(collaborator=int(user))
        if payments.count == 0:
            return serializers.ValidationError('No hay pagos para este usuario')
        return payments
    
    def get_total_amount(self, payments, **kwargs):
        value_list = kwargs.get('value_list', 'amount')
        flat = kwargs.get('flat', True)
        payments = payments.values_list(value_list, flat=flat)
        if not payments:
            total = Decimal(0)
        else:
            total = sum(map(Decimal, payments))

        return total

    def list(self, request):
        
        try:
            payments_qs = self.get_queryset()
            company = Company.objects.first()

            if not company or not payments_qs:
                return HttpResponse('No hay una empresa configurada', status=500)

            total_approved = self.get_total_amount(payments_qs.filter(status=2))
            collaborator_part = (total_approved * (Decimal(100) - company.collaborator_percentage )) / Decimal(100)
            company_part = total_approved - collaborator_part

            total_rejected = self.get_total_amount(payments_qs.filter(status=3))
            total_pending = self.get_total_amount(payments_qs.filter(status=1))
        except Exception as e:
            return HttpResponse(str(e), status=500)
        
        
        data = {
            'total': {
                'approved': total_approved,
                'rejected': total_rejected,
                'pending': total_pending,
                'company': company_part.quantize(Decimal('.01')),
                'neto': collaborator_part.quantize(Decimal('.01'))
            },
            'percentage': company.collaborator_percentage.to_integral(),
            'company': CompanySerializer(company).data ,
            'collaborator': payments_qs.first().collaborator,
            'items': self.serializer_class(payments_qs, many=True).data
        }

        print(self.serializer_class(payments_qs, many=True).data)

        try:
            html = render_to_string('../templates/report.html', data)
            result = BytesIO()
            pdf = pisa.CreatePDF(BytesIO(html.encode("UTF-8")), dest=result)
            if pdf.err:
                return HttpResponse('Error al generar el PDF', status=500)
        except Exception as e:
            return HttpResponse(str(e), status=500)
        

        response = HttpResponse(result.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="reporte.pdf"'

        return response

