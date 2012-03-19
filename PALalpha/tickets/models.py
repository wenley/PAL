from django.db import models
import urllib, re


# Create your models here.
class Ticket(models.Model):
    ticket = models.CharField(max_length=200)
    orig_date = models.DateTimeField('date created')

    def __unicode__(self):
        return self.ticket

# Some code taken from OIT's CAS How-To page
class CASClient:
    cas_url = "https://fed.princeton.edu/cas/"
    port = 8000
    service = 'http://localhost:%s/fromCAS/' % (port,)
    def validate(self, ticket):
        val_url = self.cas_url + 'validate?ticket=%s' % (ticket,)
        val_url += '&service=%s' % (self.service,)
        page = urllib.urlopen(val_url)
        r = page.readlines()
        if len(r) == 2 and re.match("yes", r[0]) != None:
            return r[1].strip()
        return None
