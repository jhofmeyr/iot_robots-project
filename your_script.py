from sphero_sprk import Sphero
direction = None

orb = Sphero("C2:92:5C:11:E1:F8")
orb.connect()
orb.set_rgb_led(255,0,0)

while direction != "x":
    print(direction)
    direction = input("which direction? type x to exit")
    if "w" in direction.lower():
        orb.roll(250,0)
    elif "a" in direction.lower():
        orb.roll(100,180)
    elif "s" in direction.lower():
        orb.roll(100,270)
    elif "d" in direction.lower():
        orb.roll(100,90)            
