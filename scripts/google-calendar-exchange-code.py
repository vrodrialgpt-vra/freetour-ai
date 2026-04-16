#!/usr/bin/env python3
import json
import os
import sys
import urllib.parse
import urllib.request
from pathlib import Path

if len(sys.argv) != 2:
    print('usage: google-calendar-exchange-code.py "<redirected-url-or-code>"', file=sys.stderr)
    sys.exit(2)

raw = sys.argv[1].strip()
params = {}
if raw.startswith('http://') or raw.startswith('https://'):
    parsed = urllib.parse.urlparse(raw)
    params = urllib.parse.parse_qs(parsed.query)
    code = params.get('code', [None])[0]
    state = params.get('state', [None])[0]
else:
    code = raw
    state = None

state_vals = {}
for path in [Path('/data/.local/share/google-calendar/oauth.env'), Path('/data/.local/share/google-calendar/oauth-state.env')]:
    for line in path.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        k, v = line.split('=', 1)
        state_vals[k] = v.strip().strip("'").strip('"')

if not code:
    print('missing code', file=sys.stderr)
    sys.exit(2)
if state is not None and state != state_vals.get('GOOGLE_OAUTH_STATE'):
    print('state mismatch', file=sys.stderr)
    sys.exit(2)

data = urllib.parse.urlencode({
    'client_id': state_vals['GOOGLE_CLIENT_ID'],
    'client_secret': state_vals['GOOGLE_CLIENT_SECRET'],
    'code': code,
    'code_verifier': state_vals['GOOGLE_PKCE_VERIFIER'],
    'grant_type': 'authorization_code',
    'redirect_uri': state_vals['GOOGLE_REDIRECT_URI'],
}).encode()
req = urllib.request.Request('https://oauth2.googleapis.com/token', data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
with urllib.request.urlopen(req, timeout=30) as resp:
    payload = json.loads(resp.read().decode())

refresh_token = payload.get('refresh_token')
if not refresh_token:
    print(json.dumps(payload, indent=2), file=sys.stderr)
    sys.exit(1)

out_path = Path('/data/.local/share/google-calendar/token.env')
out_path.write_text(f"GOOGLE_REFRESH_TOKEN='{refresh_token}'\n")
os.chmod(out_path, 0o600)
print('refresh token stored at', out_path)
