from django.http import HttpResponse
from rest_framework.response import Response
from django.template.loader import render_to_string
import xhtml2pdf.pisa as pisa
from io import BytesIO
from rest_framework import viewsets, permissions, status, serializers
from ..serializers import  PaymentSerializerWithTicketDetails, CompanySerializer
from ..models import Company, Payment
from decimal import Decimal
import datetime


class ReportViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated] # cambiar a adminuser
    serializer_class = PaymentSerializerWithTicketDetails

    def get_queryset(self):
        user = self.request.query_params.get('user')
        payments = Payment.objects.filter(collaborator=int(user))
        if not payments.exists():
            raise serializers.ValidationError('No hay pagos para este usuario')
        return payments
    
    def get_total_amount(self, payments, **kwargs):
        value_list = kwargs.get('value_list', 'amount')
        flat = kwargs.get('flat', True)
        payments = payments.values_list(value_list, flat=flat)
        if not payments:
            total = 0
        else:
            total = sum(map(int, payments))

        return total
    

    def get_week_dates(SELF, year, week):
        first_day_of_year = datetime.datetime(year, 1, 1)
        first_weekday = first_day_of_year + datetime.timedelta(days=(7 - first_day_of_year.weekday()) % 7)
        start_date = first_weekday + datetime.timedelta(weeks=week - 1)
        end_date = start_date + datetime.timedelta(days=6)
        return start_date, end_date

    def list(self, request):
        
        try:
            payments_qs = self.get_queryset()
            company = Company.objects.first()

            if not company:
                return HttpResponse('No hay una empresa configurada', status=500)

            total_approved = self.get_total_amount(payments_qs.filter(status=2))
            total_rejected = self.get_total_amount(payments_qs.filter(status=3))
            total_pending = self.get_total_amount(payments_qs.filter(status=1))

            collaborator_part = total_approved * (100 - company.collaborator_percentage) / 100
            company_part = total_approved - collaborator_part

        except serializers.ValidationError as e:
            return HttpResponse(str(e), status=400)
        except Exception as e:
            return HttpResponse('Error interno del servidor', status=500)
        
            
        year = int(request.query_params.get('year', datetime.datetime.now().year))
        week = int(request.query_params.get('week', datetime.datetime.now().isocalendar()[1]))
        start_date, end_date = self.get_week_dates(year, week)

        data = {
            'total': {
                'approved': total_approved,
                'rejected': total_rejected,
                'pending': total_pending,
                'company': company_part,
                'neto': collaborator_part
            },
            'percentage': company.collaborator_percentage,
            'company': CompanySerializer(company).data ,
            'collaborator': payments_qs.first().collaborator,
            'items': self.serializer_class(payments_qs, many=True).data,
            'date_range': {
                'start': start_date.strftime('%Y-%m-%d'),
                'end': end_date.strftime('%Y-%m-%d')
            }
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

