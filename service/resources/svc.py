"""Service Call module"""
import os
import importlib
import json
import falcon
import jsend

class ServiceCall():
    """ServiceCall class"""
    svcs_path = os.path.normpath(os.path.join(
                os.path.dirname(os.path.abspath(__file__)),
                os.pardir,
                'svcs'))
    def on_get(self, req, resp, name):
        """on get request
        return Welcome message
        """
        msg = jsend.error('Service Call failed.')

        if name == 'config.js':
            return self.config_js(req, resp)

        if name.isalnum() and os.path.isfile(os.path.join(self.svcs_path, name+'.py')):
            svc_module = importlib.import_module('service.svcs.'+name)
            svc_class = getattr(svc_module, name.capitalize())
            svc = svc_class()
            msg = svc.run(req)
        resp.body = json.dumps(msg)
        resp.status = falcon.HTTP_200
    
    def config_js(self, _req, resp):
        script = ''
        script += 'var __svcs={"ban":"/svc/ban?"}'
        resp.body = script
