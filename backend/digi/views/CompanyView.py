
from rest_framework.response import Response
from .CustomAPIView import CustomAPIView
from ..models import Company
from ..serializers import CompanySerializer
from rest_framework import permissions, status, mixins, viewsets

class CompanyViewSet(viewsets.GenericViewSet, CustomAPIView):
    serializer_class = CompanySerializer
    permission_classes = {'get': [permissions.IsAuthenticated], 'post': [permissions.IsAdminUser], 'put': [permissions.IsAdminUser], 'delete': [permissions.IsAdminUser]}

    def get_queryset(self):
        return Company.objects.first()
    

    def put(self, request):
        try:
            company =  self.get_queryset()
        
            if company:
                for key, value in request.data.items():
                    setattr(company, key, value)
                company.save()
                return Response(CompanySerializer(company).data, status=status.HTTP_200_OK)
            else:
                
                serializer = self.serializer_class(data=request.data)

                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        serializer = self.serializer_class(self.get_queryset())
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    
  
    