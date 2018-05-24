# Follow the leader

One sphero moves,  the other one follows.

### What do you need

* 2 spheros:
    * Sphero `A`: `client.js`
    * Sphero `B`: `https://github.com/OfferZen-Make/sphero-pubsub-client/blob/master/client.js`
* 2 raspberry pi's
* 2 AWS IoT Things

### Setup

1. Create 2 AWS IoT Things with certificates and policies
2. Copy certificates to `aws_certificates/` on the seperate Raspberry Pi's
3. Add robot name and mac address to the `robots` hash in `client.js`
4. Run `sudo node client.js <Thing>`
5. Move the sphero `A` that publish the action to AWS IoT and sphero `B` should receive it.
