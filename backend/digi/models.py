import jwt
import time
from datetime import datetime, timedelta
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django import forms 
from django.contrib.auth.hashers import make_password

class UserManager(BaseUserManager):
    def create_user(self, username, email, password, **extra_fields):
        if username is None:
            raise TypeError('Users must have a username.')
        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=self.normalize_email(email), **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, superuser=True, staff=True):
        if any(value is None for value in (username, email, password )):
            raise TypeError('Superusers must have a username, email and password.')

        user = self.create_user(username, email, password)
        user.is_superuser = superuser
        user.is_staff = staff
        user.save(using=self._db)
        return user

class User(AbstractBaseUser, PermissionsMixin):
    first_name   = models.CharField(max_length=50)
    last_name    = models.CharField(max_length=50)
    username     = models.CharField(db_index=True, max_length=255, unique=True)
    email        = models.EmailField(db_index=True, unique=True)
    is_superuser = models.BooleanField(default=False)
    color        = models.CharField(max_length=50, null=True, blank=True)
    is_active    = models.BooleanField(default=True)
    is_staff     = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = UserManager()

    def __str__(self):
        return self.email    

    @property
    def token(self):
        return self._generate_jwt_token()

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_roles(self):
        roles  = {"staff": self.is_staff, "superuser": self.is_superuser} 
        return [x for x in  roles if roles[x]] or ['user']

    def get_short_name(self):
        return self.username

    def _generate_jwt_token(self):
        token = jwt.encode({
            'id': self.pk,
            'sub': int(f"{self.created_at.timestamp():.0f}"),
            'exp': int(time.mktime((datetime.now() + timedelta(hours=24)).timetuple())),
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'roles': self.get_roles(),
        }, settings.SECRET_KEY, algorithm='HS256')
        return token


class Company(models.Model):
    id                      = models.AutoField(primary_key=True)
    name                    = models.CharField(max_length=100)
    logo                    = models.ImageField(upload_to='companies/', blank=True, null=True)
    address                 = models.CharField(max_length=255, blank=True, null=True)
    email                   = models.EmailField(blank=True, null=True)
    phone                   = models.CharField(max_length=20, blank=True, null=True)
    collaborator_percentage = models.IntegerField()
    created_at              = models.DateTimeField(auto_now_add=True)
    updated_at              = models.DateTimeField(auto_now=True)

class Ticket(models.Model):
    id              = models.AutoField(primary_key=True)
    collaborator    = models.ForeignKey('User', on_delete=models.CASCADE)
    category        = models.ForeignKey('Category', on_delete=models.CASCADE)
    company         = models.ForeignKey('Company', on_delete=models.CASCADE)
    payment         = models.ForeignKey('Payment', on_delete=models.CASCADE, blank=True, null=True)
    description     = models.TextField(blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True) 
    updated_at      = models.DateTimeField(auto_now=True)

class Category(models.Model):
    id              = models.AutoField(primary_key=True)
    name            = models.CharField(max_length=50)
    description     = models.TextField(blank=True, null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

class Payment(models.Model):
    id              = models.AutoField(primary_key=True)
    status          = models.CharField(max_length=1,
        choices     =   (
                     ("1", 'Pending'), 
                     ("2", 'Approved'), 
                     ("3", 'Rejected')
                     ),
        default     =   "pending")
    type            = models.CharField(max_length=50)
    amount          = models.IntegerField()
    week            = models.ForeignKey('Week', on_delete=models.CASCADE)
    collaborator    = models.ForeignKey('User', on_delete=models.CASCADE)
    created_at      = models.DateTimeField(auto_now_add=True) # change to created_at

class History(models.Model):
    id              = models.AutoField(primary_key=True)
    user            = models.ForeignKey('User', on_delete=models.CASCADE)
    description     = models.CharField(max_length=50)
    created_at      = models.DateTimeField(auto_now_add=True)


class Week(models.Model):
    id              = models.AutoField(primary_key=True)
    collaborator    = models.ForeignKey('User', on_delete=models.CASCADE)
    week_number     = models.IntegerField()
    is_paid         = models.BooleanField(default=False)
    payment_date    = models.DateTimeField(null=True)
    created_at      = models.DateTimeField(auto_now_add=True)
    collaborator_percentage = models.IntegerField(default=0)

    def generate_payments(self):
        self.is_paid = True
        self.payment_date = datetime.now()
        self.save()
        return self.is_paid

   
