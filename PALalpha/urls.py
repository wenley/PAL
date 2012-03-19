from django.conf.urls.defaults import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^login/$', 'views.toCAS'),
    url(r'^fromCAS/$', 'views.fromCAS'),
    url(r'^main/(?P<ticket_id>\d+)/$', 'views.front'),

    # Examples:
    # url(r'^$', 'PALalpha.views.home', name='home'),
    # url(r'^PALalpha/', include('PALalpha.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
