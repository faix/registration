import django_tables2 as tables
from hardware.models import Request, Lending

class RequestTable(tables.Table):
	class Meta:
		model = Request
		template_name = 'django_tables2/bootstrap-responsive.html'

class LendingTable(tables.Table):
	class Meta:
		model = Lending
		template_name = 'django_tables2/bootstrap-responsive.html'