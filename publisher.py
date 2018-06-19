import json
import threading

import inputs
import os
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

MQTTClient = AWSIoTMQTTClient("PythonPub")
dir_path = os.path.dirname(os.path.realpath(__file__))
MQTTClient.configureCredentials(dir_path + "/root_ca.pem", dir_path + "/aws_key.key", dir_path + "/aws_cert.crt")
MQTTClient.configureEndpoint("a2yujzh40clf9c.iot.us-east-2.amazonaws.com", 8883)
MQTTClient.configureConnectDisconnectTimeout(10)
MQTTClient.configureMQTTOperationTimeout(5)
MQTTClient.connect()


A = "BTN_THUMB"
B = "BTN_THUMB2"
Y = "BTN_TOP"
X = "BTN_TRIGGER"

button_list = [A,B,Y,X]

class PublisherThread(object):

   def __init__(self, payload):
       self.thread = threading.Thread(target=self.run, args=(payload,))
       self.thread.daemon = True

   def run(self, payload):
       MQTTClient.publish("logitec/buttons/load", payload, 0)


def run_event_loop():
   while True:
       events = inputs.get_gamepad()
       for event in events:
           if event.code in button_list:
               payload = generate__button_payload(event.code, event.state)
               publisher_thread = PublisherThread(payload)
               publisher_thread.thread.start()


def generate__button_payload(button_code, button_state):
   test_payload = {
       "button": button_code,
       "state": button_state
   }
   return json.dumps(test_payload)


run_event_loop()