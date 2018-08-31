import django_tables2 as tables
from hardware.models import Request, Lending

class RequestTable(tables.Table):
    remaining_time = tables.TemplateColumn(
        "{{record.get_remaining_time}}",
        verbose_name='Remaining time')
    class Meta:
        model = Request
        template_name = 'django_tables2/bootstrap-responsive.html'
        fields = ['id', 'item_type', 'user', 'lending', 'request_time', 'remaining_time']

class LendingTable(tables.Table):
    class Meta:
        model = Lending
        template_name = 'django_tables2/bootstrap-responsive.html'