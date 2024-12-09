from django.apps import AppConfig

class DigiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'digi'

    # def ready(self):
    #     from .models import User
    #     try: 
    #         pass
    #         # User.objects.create_superuser(email="admin@gmail.com", username="admin", password="admin123", superuser=True, staff=True)
    #         # User.objects.create_user(first_name="Eduardo", last_name="Ferreras", email="edferreras@mip.gob.do", username="edferreras", password="Miclave123.", superuser=True, staff=True)
    #         # User.objects.create_user(email="esosa@mip.gob.do", username="esosa", password="Miclave123.")
    #     except Exception as e:
    #         print(e)
    #         print("Superuser already exists")
    #         pass
              

        




