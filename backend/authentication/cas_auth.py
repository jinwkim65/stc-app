from flask import Blueprint, request, session, redirect, url_for, jsonify

from cas import CASClient
from urllib.parse import urlencode

cas_auth = Blueprint('cas_auth', __name__)

#original service url http://localhost:5050/login?next=%2Fprofile



# Create a CASClient object
encode_path = urlencode({'next': '/login'})
cas_client = CASClient(
    version=3,
    service_url=f'http://localhost:3000/login?{encode_path}',
    server_url=('https://secure6.its.yale.edu/cas/login?'
                'service=https://localhost:55555/index')
)

@cas_auth.route('/')
def index():
    body = """<!DOCTYPE html>
<html>
  <head>
    <title>python-cas Flask example demo</title>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0">
  </head>
  <body>
    <h1>Heyy Thereee!!</h1>
  </body>
</html>
"""
    return body



@cas_auth.route('/login')
def login():
    if 'username' in session:
        # Already logged in

        return redirect(url_for('cas_auth.profile'))

    next = request.args.get('next')
    ticket = request.args.get('ticket')

    print("first checker of ticket is:{}".format(ticket) )


    if not ticket:
        # No ticket, the request come from end user, send to CAS login
        cas_login_url = cas_client.get_login_url()
        # app.logger.debug('CAS login URL: %s', cas_login_url)
        return {"login_url" :cas_login_url}

    # There is a ticket, the request come from CAS as callback.
    # need call `verify_ticket()` to validate ticket and get user profile.
    # app.logger.debug('ticket: %s', ticket)
    # app.logger.debug('next: %s', next)

    print("ticket:", ticket)
    print("were validating the ticket")

    user, attributes, pgtiou = cas_client.verify_ticket(ticket)

    # app.logger.debug(
    #     'CAS verify ticket response: user: %s, attributes: %s, pgtiou: %s', user, attributes, pgtiou)

    if not user:
        return 'Failed to verify ticket. <a href="/login">Login</a>'
    else:  # Login successfully, redirect according `next` query parameter.
        session['username'] = user
        print("user:", session['username'])
        return jsonify({'username': session['username']})


@cas_auth.route('/logout')
def logout():
    redirect_url = url_for('cas_auth.logout_callback', _external=True)
    cas_logout_url = cas_client.get_logout_url(redirect_url)
    # app.logger.debug('CAS logout URL: %s', cas_logout_url)

    return redirect(cas_logout_url)


@cas_auth.route('/logout_callback')
def logout_callback():
    # redirect from CAS logout request after CAS logout successfully
    session.pop('username', None)
    return 'Logged out from CAS. <a href="/login">Login</a>'


@cas_auth.route('/ping')
def ping():
    return {'message': 'Pong!'}
