import json
import datetime
import bson.objectid as bson


def json_serial(obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    if isinstance(obj, bson.ObjectId):
        return str(obj)
    raise TypeError("Type %s not serializable" % type(obj))


def dic_to_json(doc):
    return json.dumps(doc, default=json_serial)


def body_to_dic(body):
    return json.loads(body)