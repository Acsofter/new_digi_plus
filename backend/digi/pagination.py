from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class PaymentPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count'     : self.page.paginator.count,
            'pages'     : self.page.paginator.num_pages,
            'next'      : self.get_next_link(),
            'previous'  : self.get_previous_link(),
            'current'   : self.page.number,
            'results'   : data
        })
    
class CategoryPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count'     : self.page.paginator.count,
            'pages'     : self.page.paginator.num_pages,
            'next'      : self.get_next_link(),
            'previous'  : self.get_previous_link(),
            'current'   : self.page.number,
            'results'   : data
        })


class TicketPagination(PageNumberPagination):
    page_size = 5
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count'     : self.page.paginator.count,
            'pages'     : self.page.paginator.num_pages,
            'next'      : self.get_next_link(),
            'previous'  : self.get_previous_link(),
            'current'   : self.page.number,
            'results'   : data
        })
    

class UserPagination(PageNumberPagination):
    page_size = 10
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response({
            'count'     : self.page.paginator.count,
            'pages'     : self.page.paginator.num_pages,
            'next'      : self.get_next_link(),
            'previous'  : self.get_previous_link(),
            'current'   : self.page.number,
            'results'   : data
        })  