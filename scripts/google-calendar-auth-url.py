#!/usr/bin/env python3
import base64
import hashlib
import os
import secrets
import urllib.parse
from pathlib import Path

ENV_PATH = Path('/data/.local/share/google-calendar/oauth.env')
vals = {}
for line in ENV_PATH.read_text().splitlines():
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line:
        continue
    k, v = line.split('=', 1)
    vals[k] = v.strip().strip("'").strip('"')

client_id = vals['GOOGLE_CLIENT_ID']
state = secrets.token_urlsafe(24)
verifier = secrets.token_urlsafe(64)
challenge = base64.urlsafe_b64encode(hashlib.sha256(verifier.encode()).digest()).decode().rstrip('=')
redirect_uri = 'http://127.0.0.1:53682/callback'
scope = 'https://www.googleapis.com/auth/calendar.readonly'
url = 'https://accounts.google.com/o/oauth2/v2/auth?' + urllib.parse.urlencode({
    'client_id': client_id,
    'redirect_uri': redirect_uri,
    'response_type': 'code',
    'scope': scope,
    'access_type': 'offline',
    'prompt': 'consent',
    'state': state,
    'code_challenge': challenge,
    'code_challenge_method': 'S256',
})
state_path = Path('/data/.local/share/google-calendar/oauth-state.env')
state_path.write_text(f"GOOGLE_OAUTH_STATE='{state}'\nGOOGLE_PKCE_VERIFIER='{verifier}'\nGOOGLE_REDIRECT_URI='{redirect_uri}'\nGOOGLE_SCOPE='{scope}'\n")
os.chmod(state_path, 0o600)
print(url)
