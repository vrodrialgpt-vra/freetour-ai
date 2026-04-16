#!/usr/bin/env python3
import json
import subprocess
import sys
from email.utils import parsedate_to_datetime

LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 25
raw = subprocess.check_output([
    'himalaya', 'envelope', 'list', '--page-size', str(LIMIT), '--output', 'json'
], text=True)
items = json.loads(raw)
rows = []
for item in items:
    flags = item.get('flags') or []
    unread = 'Seen' not in flags
    sender = (item.get('from') or {}).get('addr') or ''
    subject = (item.get('subject') or '').strip()
    date = item.get('date')
    try:
        dt = parsedate_to_datetime(date) if date else None
        iso = dt.isoformat() if dt else None
    except Exception:
        iso = date
    important = unread and (
        'google' not in sender.lower() or 'alerta de seguridad' in subject.lower()
    )
    rows.append({
        'id': item.get('id'),
        'unread': unread,
        'important': important,
        'from': sender,
        'subject': subject,
        'date': iso,
    })
print(json.dumps({
    'count': len(rows),
    'unread_count': sum(1 for r in rows if r['unread']),
    'important_unread_count': sum(1 for r in rows if r['important']),
    'items': rows,
}, ensure_ascii=False))
