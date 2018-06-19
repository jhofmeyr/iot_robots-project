import random
from pynput import keyboard
from sphero_sprk import Sphero

orb = Sphero("C2:92:5C:11:E1:F8")
orb.connect()
speed = 5

def on_press(key):
    colour = None
    try:
        if not colour:
            #colour = get_random_colour()
            orb.set_rgb_led(get_random_colour())
        if key.char == 'c':
            colour = get_random_colour()
            orb.set_rgb_led(colour)
        if key.char == 'w':
            orb.roll(speed, 0)
        elif key.char == 'a':
            orb.roll(speed, 270)
        elif key.char == 's':
            orb.roll(speed, 180)
        elif key.char == 'd':
            orb.roll(speed, 90)
    except AttributeError:  
        print('special key {0} pressed'.format(key))

def on_release(key):
    orb.roll(0,0)
    print('{0} released'.format(key))
    if key == keyboard.Key.esc:
        return False

def get_random_colour():
    r, g, b = random.randint(1,255), random.randint(1,255), random.randint(1,255)
    print(str(r) + str(g) + str( b))
    return r, g, b

with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    colour = get_random_colour()
    listener.join()
