import random
from pynput import keyboard
from sphero_sprk import Sphero

orb = Sphero("C2:92:5C:11:E1:F8")
orb.connect()
speed = 40

class Listener():
    
    def __init__(self):
        self.colour = None
        self.direction = 0

    def on_press(self, key):
        print(self.direction)
        if self.direction < 0:
            self.direction = 360 - self.direction
        else:
            self.direction = self.direction % 360

        print(self.direction)
        try:
            if not self.colour:
                orb.set_rgb_led( random.randint(1,255), random.randint(1,255), random.randint(1,255))
                self.colour = True
            if key == 'q':
                self.direction += 10
            if key == 'e':
                self.direction -= 10
            if key == 'c':
                orb.set_rgb_led( random.randint(1,255), random.randint(1,255), random.randint(1,255))
            if key == 'w':
                orb.roll(speed, self.direction)
            if key == 'a':
                orb.roll(speed, self.direction + 270)
            if key == 's':
                orb.roll(speed, self.direction + 180)
            if key == 'd':
                orb.roll(speed, self.direction + 90)
        except AttributeError:  
            print('special key {0} pressed'.format(key))

    def on_release(self, key):
        speed = 20
            
        #if key.char == 'q':
         #   orb.roll(0, self.direction+45)
        if key == 'w':
            orb.roll(speed, 0)
        if key == 'a':
            orb.roll(speed, 270)
        if key == 's':
           orb.roll(speed, 180)
        if key == 'd':
           orb.roll(speed, 90)
        
        orb.roll(0,0)
        self.colour = None
        print('{0} released'.format(key))
        if key == keyboard.Key.esc:
            return False

#l = Listener()
#with keyboard.Listener(on_press=l.on_press, on_release=l.on_release) as listener:
 #   listener.join()
