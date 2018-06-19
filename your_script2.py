from sphero_sprk import Sphero
import time
import _thread as thread

direction = None

orb = Sphero("C2:92:5C:11:E1:F8")
orb.connect()
orb.set_rgb_led(255,0,0)

def input_thread(L):
    i = input()
    L.append(i)

L= []
while direction != "x": 
    thread.start_new_thread(input_thread, (L,)) #  print(direction)
    #direction = input("which direction? type x to exit")
    if len(L) > 0:
        direction = L.pop()
        print(direction)
        if "w" in direction.lower():
            orb.roll(100,0)
        elif "a" in direction.lower():
            orb.roll(100,180)
        elif "s" in direction.lower():
            orb.roll(100,270)
        elif "d" in direction.lower():
            orb.roll(100,90) 
