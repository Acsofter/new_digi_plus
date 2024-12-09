from django.urls import include, path
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.routers import DefaultRouter


from .views import AuthViewSet, CompanyViewSet, UserViewSet, TicketViewSet, CategoryViewSet, PaymentViewSet, MetricsViewSet, ReportViewSet, WeekViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'users', UserViewSet, basename='users')
router.register(r'company', CompanyViewSet, basename='company')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'metrics', MetricsViewSet, basename='metric')
router.register(r'report', ReportViewSet, basename='report')
router.register(r'week', WeekViewSet, basename='week')

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)