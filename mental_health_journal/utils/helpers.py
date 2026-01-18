import logging


logger = logging.getLogger(__name__)




def safe_get(d: dict, key: str, default=None):
v = d.get(key, default)
return v