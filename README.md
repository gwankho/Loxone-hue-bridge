# Loxone → Node-RED → Philips Hue Bridge  
### A reliable and local integration between Loxone and Philips Hue using Node-RED

---

## 🔧 About this Project
Controlling **Philips Hue** lights directly from **Loxone** has always been tricky.  
This project bridges the two systems using **Node-RED** running on a **Raspberry Pi** or in **Docker** (got them both running),  
with a small **JavaScript mapping function** that normalizes events and payloads between Loxone and Hue.

Everything runs **locally** – no external cloud or remote services required.

I tried everything to get it running without a service like Node-RED but did not get that working, the Pico-C code made my Loxone unstable (which is an achievement as such).So unfortunately with an extra component I got everything working pretty stable

So without further adue
---
## Hardware
####Set 1
####Loxone miniserver (100335)
####Raspberry Pi 3 4GB
####Hue bridge v2

Set 2
Loxone miniserver (100335)
Synology DS918+ Docker(Container Manger)
Hue bridge v2

The sets react exctly the same

## Architecture


[Loxone Miniserver]
      │  (UDP / HTTP / WebSocket)
      ▼
[Node-RED (Docker / Raspberry Pi)]
      ├── node-red-contrib-loxone
      ├── Function node (custom JS mapping)
      └── node-red-contrib-huemagic
            │
            ▼
      [Philips Hue Bridge → Zigbee → Lights]# Loxone-hue-bridge
Full Control over Hue lights with Loxone
