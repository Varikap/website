#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals
import sys
sys.path.append('.')

AUTHOR = u'~TM'
SITENAME = u'Tilda Center'
SITEURL = ''
OUTPUT_PATH = 'output'

PAGE_PATHS = ['pages', 'events']
PAGE_URL = '{slug}'
PAGE_SAVE_AS = 'pages/{slug}/index.html'

DISPLAY_PAGES_ON_MENU = False
DISPLAY_CATEGORIES_ON_MENU = False

THEME = 'theme'
THEME_STATIC_DIR = 'static'

INDEX_SAVE_AS = 'blog/index.html'
ARTICLE_PATHS = ['blog']
ARTICLE_URL = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'blog/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
TIMEZONE = 'Europe/Belgrade'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = 'feeds/atom.xml'
CATEGORY_FEED_ATOM = 'feeds/categories/%s/atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
TAG_FEED_ATOM = 'feeds/tags/%s/atom.xml'

# Blogroll
LINKS = (
    ('Pelican', 'http://getpelican.com/'),
    ('Python.org', 'http://python.org/'),
    ('Jinja2', 'http://jinja.pocoo.org/'),
    ('You can modify those links in your config file', '#'),
)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 6

from utils import filters
JINJA_FILTERS = {'sidebar': filters.sidebar }
JINJA_EXTENSIONS = ['jinja2.ext.with_',]

PLUGINS = ['google_embed']

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

DELETE_OUTPUT_DIRECTORY = True
