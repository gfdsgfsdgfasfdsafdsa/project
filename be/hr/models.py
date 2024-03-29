from django.db import models
from users.models import USER_TYPES, SALESEXECUTIVE
from django.utils.timezone import now


CORE = "CORE"
KPI = "KPI"
TYPES = (
    (CORE, "Core"),
    (KPI, "KPI"),
)
class EvaluationRubric(models.Model):
    type = models.CharField(max_length=20, choices=TYPES, default=CORE)
    employee_type = models.CharField(max_length=20, choices=USER_TYPES, default=SALESEXECUTIVE)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    percentage = models.IntegerField()
    editable = models.BooleanField(default=True)

    def __str__(self):
            return self.name
    class Meta: 
        verbose_name_plural = 'Rubrics'


class EmployeeEvaluation(models.Model):
    employee = models.ForeignKey('users.User', 
        on_delete=models.CASCADE, blank=True, null=True, related_name='employee_evaluation')
    date_created = models.DateTimeField(default=now)
    review_period = models.CharField(max_length=255, null=True)

    def __str__(self):
            return self.employee.user_employee.firstname + ' ' + self.employee.user_employee.mi + ' ' + self.employee.user_employee.lastname

    class Meta: 
        verbose_name_plural = 'Evaluation'

class EmployeeEvaluationDetail(models.Model): 
    type = models.CharField(max_length=20, choices=TYPES, default=CORE)
    employee_evaluation = models.ForeignKey('hr.EmployeeEvaluation', 
        on_delete=models.CASCADE, blank=True, null=True, related_name='employee_evaluation')
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    percentage = models.IntegerField()
    score = models.DecimalField(default=0, max_digits=20, decimal_places=2)


class BackJobs(models.Model):
    user = models.ForeignKey('users.User', 
        on_delete=models.CASCADE, blank=True, null=True, related_name='employee_backjobs')
    customer_name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    reason = models.CharField(max_length=255, default='')
    date = models.DateTimeField(default=now)

    class Meta: 
        verbose_name_plural = 'Backjobs'

    def __str__(self):
            return self.user.user_employee.firstname + ' ' + self.user.user_employee.mi + ' ' + self.user.user_employee.lastname

class Sales(models.Model):
    user = models.ForeignKey('users.User', 
        on_delete=models.CASCADE, blank=True, null=True, related_name='employee_sales')
    date = models.DateTimeField(default=now)
    item_deal = models.CharField(max_length=255)
    amount = models.DecimalField(default=0, max_digits=20, decimal_places=2)

    class Meta: 
        verbose_name_plural = 'Sales'

    def __str__(self):
            return self.user.user_employee.firstname + ' ' + self.user.user_employee.mi + ' ' + self.user.user_employee.lastname
