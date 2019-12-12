import json
import requests
import os
import jwt
from cryptography.hazmat.backends import default_backend
from cryptography.x509 import load_pem_x509_certificate

AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID")
AUTH0_CLIENT_PUBLIC_KEY = os.getenv("AUTH0_CLIENT_PUBLIC_KEY")
AUTH0_JWKS_URL = os.getenv("AUTH0_JWKS_URL")


def decode_jwt_token(auth_token):
    public_key = get_jwt_public_key(auth_token)
    return jwt.decode(auth_token, public_key, algorithms=["RS256"], audience=AUTH0_CLIENT_ID)


def get_jwt_public_key(auth_token):
    if AUTH0_CLIENT_PUBLIC_KEY:
        return get_jwt_public_key_from_environment()
    elif AUTH0_JWKS_URL:
        return get_jwt_public_key_from_jwks_url(auth_token)
    raise Exception("Missing AUTH0_CLIENT_PUBLIC_KEY or AUTH0_JWKS_URL")


def get_jwt_public_key_from_environment():
    public_key = format_public_key(AUTH0_CLIENT_PUBLIC_KEY)
    return convert_certificate_to_pem(public_key)


def get_jwt_public_key_from_jwks_url(token):
    jwks = requests.get(AUTH0_JWKS_URL).json()
    public_keys = {}
    for jwk_key in jwks["keys"]:
        kid = jwk_key["kid"]
        public_keys[kid] = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(jwk_key))
    kid = jwt.get_unverified_header(token)["kid"]
    return public_keys[kid]


def convert_certificate_to_pem(public_key):
    cert_str = public_key.encode()
    cert_obj = load_pem_x509_certificate(cert_str, default_backend())
    pub_key = cert_obj.public_key()
    return pub_key


def format_public_key(public_key):
    public_key = public_key.replace("\n", " ").replace("\r", "")
    public_key = public_key.replace("-----BEGIN CERTIFICATE-----", "-----BEGIN CERTIFICATE-----\n")
    public_key = public_key.replace("-----END CERTIFICATE-----", "\n-----END CERTIFICATE-----")
    return public_key
