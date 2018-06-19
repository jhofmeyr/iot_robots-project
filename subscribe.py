#!/usr/bin/python

# this source is part of my Hackster.io project:  https://www.hackster.io/mariocannistra/radio-astronomy-with-rtl-sdr-raspberrypi-and-amazon-aws-iot-45b617

# use this program to test the AWS IoT certificates received by the author
# to participate to the spectrogram sharing initiative on AWS cloud

# this program will subscribe and show all the messages sent by its companion
# awsiotpub.py using the AWS IoT hub

import paho.mqtt.client as paho
import os
import socket
import ssl
import json
from listener2 import Listener

CERTS_DIR = "certs"
ROOT_CA = "root_ca.pem"
PRIVATE_KEY = "private_key.pem.key"
CERTIFICATE = "certificate.pem.crt"
l = Listener()
def on_connect(client, userdata, flags, rc):
    print("Connection returned result: " + str(rc))
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe('best-sphero-topic-ever', 1)


def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode("utf-8") )
    key = payload.get("key")
    print("key: " + str(payload.get("key")))   
    print("press: " + str(payload.get("press")))
    if payload.get("press"):
        l.on_press(key)
    #else:
     #   l.on_release(key)

# def on_log(client, userdata, level, msg):
#    print(msg.topic+" "+str(msg.payload))

mqttc = paho.Client()
mqttc.on_connect = on_connect
mqttc.on_message = on_message
# mqttc.on_log = on_log
awshost = "a2yujzh40clf9c.iot.us-east-2.amazonaws.com"
awsport = 8883
clientId = "makeSphero"
caPath = "{}/{}".format(CERTS_DIR, ROOT_CA)
certPath = "{}/{}".format(CERTS_DIR, CERTIFICATE)
keyPath = "{}/{}".format(CERTS_DIR, PRIVATE_KEY)

mqttc.tls_set(caPath, certfile=certPath, keyfile=keyPath, cert_reqs=ssl.CERT_REQUIRED, tls_version=ssl.PROTOCOL_TLSv1_2,
                ciphers=None)

mqttc.connect(awshost, awsport, keepalive=60)

mqttc.loop_forever()

