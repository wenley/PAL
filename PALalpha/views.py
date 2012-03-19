from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from django.core.urlresolvers import reverse

from tickets.models import Ticket, CASClient
import datetime

def toCAS(request):
    C = CASClient()
    url = C.cas_url + ('login?service=%s' % C.service)
    return HttpResponseRedirect(url)

def fromCAS(request):
    try:
        ticket = request.GET['ticket']
        print ticket
        print Ticket.objects.all()
        try:
            t = Ticket.objects.get(ticket=ticket)
            print "Found existing ticket"
        except Ticket.DoesNotExist:
            print "Making new ticket"
            t = Ticket(ticket=ticket, orig_date=datetime.datetime.now())
            t.save()
    except KeyError:
        return Http404
    else:
        return HttpResponseRedirect('/main/%s' % t.id)

def front(request, ticket_id):
    t = get_object_or_404(Ticket, pk=ticket_id)
    C = CASClient()
    netid = C.validate(t.ticket)
    if netid is None:
        return HttpResponse("Invalid ticket?")
    content = "Your netid is %s.<p>Your ticket number is %s." % (netid, t.ticket)
    t.delete()
    return HttpResponse(content)
