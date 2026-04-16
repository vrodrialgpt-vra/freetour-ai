#!/usr/bin/env python3
import json
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

MAX_RESULTS = int(sys.argv[1]) if len(sys.argv) > 1 else 10
WINDOW_HOURS = int(sys.argv[2]) if len(sys.argv) > 2 else 48

vals = {}
for path in ['/data/.local/share/google-calendar/oauth.env', '/data/.local/share/google-calendar/token.env']:
    for line in Path(path).read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        vals[k] = v.strip().strip("'").strip('"')

post = urllib.parse.urlencode({
    'client_id': vals['GOOGLE_CLIENT_ID'],
    'client_secret': vals['GOOGLE_CLIENT_SECRET'],
    'refresh_token': vals['GOOGLE_REFRESH_TOKEN'],
    'grant_type': 'refresh_token',
}).encode()
req = urllib.request.Request('https://oauth2.googleapis.com/token', data=post, headers={'Content-Type': 'application/x-www-form-urlencoded'})
with urllib.request.urlopen(req, timeout=30) as r:
    token = json.loads(r.read().decode())['access_token']

now = datetime.now(timezone.utc)
time_min = now.isoformat().replace('+00:00', 'Z')
time_max = (now + timedelta(hours=WINDOW_HOURS)).isoformat().replace('+00:00', 'Z')
calendar_id = urllib.parse.quote(vals.get('GOOGLE_CALENDAR_ID', 'primary'), safe='')
url = (
    f'https://www.googleapis.com/calendar/v3/calendars/{calendar_id}/events?'
    + urllib.parse.urlencode({
        'maxResults': MAX_RESULTS,
        'singleEvents': 'true',
        'orderBy': 'startTime',
        'timeMin': time_min,
        'timeMax': time_max,
    })
)
req = urllib.request.Request(url, headers={'Authorization': f'Bearer {token}'})
with urllib.request.urlopen(req, timeout=30) as r:
    data = json.loads(r.read().decode())

items = []
for item in data.get('items', []):
    start = item.get('start', {}).get('dateTime') or item.get('start', {}).get('date')
    end = item.get('end', {}).get('dateTime') or item.get('end', {}).get('date')
    items.append({
        'id': item.get('id'),
        'summary': item.get('summary', '(sin título)'),
        'start': start,
        'end': end,
        'location': item.get('location'),
        'htmlLink': item.get('htmlLink'),
    })

print(json.dumps({'count': len(items), 'items': items}, ensure_ascii=False))
