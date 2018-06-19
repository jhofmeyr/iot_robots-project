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
BUTTON_TOPIC = "logitec/buttons/load"

X_AXIS = "ABS_X"
Y_AXIS = "ABS_Y"
MOVEMENT_TOPIC = "logitec/movement/load"

X_AXIS_MOTOR = "ABS_Z"
Y_AXIS_MOTOR = "ABS_RZ"
MOTOR_MOVEMENT_TOPIC = "logitec/movement/load2"

axis_list = [X_AXIS, Y_AXIS]
motor_list = [X_AXIS_MOTOR,Y_AXIS_MOTOR]
button_list = [A,B,Y,X]

class PublisherThread(object):

   def __init__(self, payload, topic):
       self.thread = threading.Thread(target=self.run, args=(payload,topic))
       self.thread.daemon = True

   def run(self, payload, topic):
       MQTTClient.publish(topic, payload, 0)


def run_event_loop():
   event_loop_counter = 0 
   while True:
       current_x = 0
       current_y = 0
       
       current_motor_x = 0
       current_motor_y = 0
       
       events = inputs.get_gamepad()
       for event in events:
           print("event code: {0}, event state: {1}".format(event.code,event.state))
           if event.code in button_list:
               payload = generate__button_payload(event.code, event.state)
               publisher_thread = PublisherThread(payload, BUTTON_TOPIC)
               publisher_thread.thread.start()
               
           if event.code in axis_list:
               if event.code == X_AXIS:
                   current_x = event.state - 127
               if event.code == Y_AXIS:
                   current_y = event.state - 128
               payload = generate_movement_payload(current_x,current_y)
               publisher_thread = PublisherThread(payload, MOVEMENT_TOPIC)
               publisher_thread.thread.start()
            
           if event.code in motor_list:
               if event.code == Y_AXIS_MOTOR:
                   current_motor_y = event.state - 127
               if event.code == X_AXIS_MOTOR:
                   current_motor_x = event.state - 127  
               payload = generate_motor_payload(current_motor_x,current_motor_y)
               publisher_thread = PublisherThread(payload, MOTOR_MOVEMENT_TOPIC)
               publisher_thread.thread.start()
                
def generate_movement_payload(x,y):
    movement_payload = {
        "x":x,
        "y":y
    }
    return json.dumps(movement_payload)

def generate_motor_payload(x,y):
    motor_payload = {
        "motor_x":x,
        "motor_y":y
    }
    return json.dumps(motor_payload)
    
def generate__button_payload(button_code, button_state):
   button_payload = {
       "button": button_code,
       "state": button_state
   }
   return json.dumps(button_payload)


run_event_loop()