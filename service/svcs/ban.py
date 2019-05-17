"""BAN module"""
import os
from http.client import responses
import jsend
import requests

class Ban():
    """APICall class"""
    def run(self, req):
        """on get request
        return Welcome message
        """
        jdata = jsend.error('ERROR')
        if 'id' in req.params:
            data = self.process(req.params['id'])
            if isinstance(data, list):
                jdata = jsend.success({'locations':self.etl(data)})
            elif isinstance(data, str):
                jdata = jsend.error(data)
            elif isinstance(data, dict):
                jdata = jsend.fail(data)
        return jdata

    def process(self, ban):
        url = os.environ.get('API_BAN') + '&apikey=' + os.environ.get('API_KEY')
        payload = {"BAN":ban}
        headers = {}
        request = requests.post(url, json=payload, headers=headers)
        if request.status_code == 200:
            if request.text:
                return request.json()
            else:
                return 'EMPTY'
        else:
            return {'status_code': str(request.status_code), 'message': str(responses[request.status_code])}

    def etl(self, data):

        return data