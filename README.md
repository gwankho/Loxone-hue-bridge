# Loxone → Node-RED → Philips Hue Bridge  
### A reliable and local integration between Loxone and Philips Hue using Node-RED

---

## 🔧 About this Project
Controlling **Philips Hue** lights directly from **Loxone** has always been tricky.  
This project bridges the two systems using **Node-RED** running on anything like a simple **Windows PC**, **Raspberry Pi** or in **Docker**,  
with a small **JavaScript mapping function** that normalizes events and payloads between Loxone and Hue.

Everything runs **locally** – no external cloud or remote services required.
It works with a standard Lighting Controller in Loxone and suports temp based colors, RGB colors and sequences.
<p align="center">
  <img src="https://github.com/user-attachments/assets/d966b745-9981-4c44-89cb-dbb305aef612" width="30%" />
  <img src="https://github.com/user-attachments/assets/e6195b2b-1eb2-4fa8-8bb0-60b849ed23d8" width="30%" />
  <img src="https://github.com/user-attachments/assets/0bbd137b-782b-4ffc-b6a7-d09b06c82dd4" width="30%" />
</p>

I tried everything to get it running without a service like Node-RED but did not get that working, the Pico-C code made my Loxone unstable (which is an achievement as such).So unfortunately with an extra component I got everything working pretty stable

Everything works, HSV (white temp), RGB and even sequences (party mode).

So apart from your Loxone and Hue devices you need Node-RED open source on something that runs already in your home (like my Synology) or if you really do not have anything buy a Raspberry Pi (I made it pretty by buying a EUR 15 DIN Housing and a EUR 8 LCD)
<img width="325" height="375" alt="Screenshot 2025-10-15 at 16 06 48" src="https://github.com/user-attachments/assets/4ee18a90-6fdb-497b-a5c8-4e13dc2d94f2" />


So without further ado
---
## Hardware
**Set 1**

Loxone miniserver (100335)

MacBook

Hue bridge v2

**Set 2**

Loxone miniserver (100335)

Raspberry Pi 3 4GB

Hue bridge v2


**Set 3**

Loxone miniserver (100335)

Synology DS918+ Docker(Container Manager)

Hue bridge v2

The sets react exactly the same

## Architecture


```mermaid
flowchart TB
  L["Loxone Miniserver<br/>(Virtual Outputs & Lighting Controller)"] --> NR
  NR --> H["Philips Hue Bridge<br/>(Zigbee Network)"]

  %% Node-RED instance (geel)
  subgraph NR ["Node-RED Instance"]
    style NR fill:#fff8dc,stroke:#999,stroke-width:1px
    NR1["node-red-contrib-loxone"]
    NR2["Function Node<br/>(RGB · Temp · HSV Mapping)"]
    NR3["node-red-contrib-huemagic"]
    NR1 --> NR2 --> NR3
  end

  %% Platform onderaan
  subgraph P ["Platform Node-RED"]
    P1["Docker / Raspberry Pi / Synology"]
    P2["Local Network"]
    P1 --> P2
  end

  NR --> P
```

## How it Works

1. Loxone is programmed with a lighting controller which sends an RGB value to a Loxone Virtual Output 
2. Node-RED receives the payload through `node-red-contrib-loxone`.  
3. A Function node (JavaScript) maps the payload to Hue commands.  
4. The result is passed to `node-red-contrib-huemagic` → Hue Bridge.
   
## Setup / Installation
**Loxone**
Assuming a working Loxone Miniserver

Add a lighting controller

Add a Virtual Output "Hue", to get rid of any configuration incomplete message, put in the Hue Bridge IP address 
<img width="341" height="685" alt="Screenshot 2025-10-15 at 16 14 32" src="https://github.com/user-attachments/assets/80958a1b-3fc5-48d5-ae93-7f8577144e8e" />

Add a Virtual output command to that Virtual Output, make sure "Use as Digital Output" is off as RGB is not just a true or false. No other config needed
<img width="303" height="65" alt="Screenshot 2025-10-15 at 16 17 04" src="https://github.com/user-attachments/assets/3e29ec69-a84c-400c-9f77-e6e416ceafba" />

Connect that Virtual output command to the controller
<img width="1011" height="319" alt="Screenshot 2025-10-15 at 16 20 35" src="https://github.com/user-attachments/assets/6b07866f-02b1-4614-97c6-fb4ee4df3b48" />

Submit to the Miniserver (save)
Then set the Light circuit (here LC1) to RGB
<img width="925" height="590" alt="Screenshot 2025-10-15 at 16 21 27" src="https://github.com/user-attachments/assets/f6ced43d-c1d3-4dac-9046-a3b55d9d55f8" />

And make a nice mood just to test
<img width="929" height="593" alt="Screenshot 2025-10-15 at 16 23 14" src="https://github.com/user-attachments/assets/393461e8-2ba0-4881-acde-eab184a73361" />

That's it for Loxone

A switch like a T5 is useful but not really needed if you use the Loxone app

**Node-RED**

Get something that supports Node-RED, any PC, Mac, Linux, Docker, Azure, Amazon or Raspberry will work. I started by just installing it on my Mac to see if it worked.

Use the official Node-RED website http://nodered.org, they got a great "Getting Started" section.

After installation on any platform, you just type in the IP or hostname on port 1880. Eg. http://127.0.0.1:1880 if it runs on your computer.

Go to manage palette and install node-red-contrib-huemagic-fork and node-red-contrib-loxone (go to the tab install and type those names, no need for a separate download)
<img width="2138" height="1724" alt="CleanShot 2025-10-15 at 16 35 09@2x" src="https://github.com/user-attachments/assets/0c6acb8d-1745-4abb-9049-1ee1b3b96ad6" />

If you see the palette screen like this you are good!

**You are almost there**
**Now connect Hue to Node-RED**

Hue is straightforward, drag and drop the Hue bridge on your environment
<img width="2100" height="1600" alt="CleanShot 2025-10-15 at 16 45 09@2x" src="https://github.com/user-attachments/assets/35a65a60-d77c-415c-8af9-b018542181f0" />

Type in the IP address (or better, click find)
Then you need to enter your API key, click on the icon behind it and press the Hue button within a few seconds

<img width="2100" height="1600" alt="CleanShot 2025-10-15 at 16 45 09@2x" src="https://github.com/user-attachments/assets/b25a4d6d-fad4-4221-86c5-468f9ab0fe53" />

Now add a Hue light 

<img width="2126" height="946" alt="CleanShot 2025-10-15 at 16 50 46@2x" src="https://github.com/user-attachments/assets/46187259-3398-4913-958f-1be7594db6ed" />

Name it any useful name

Select your bridge

Click on the magnifier to select a light

**Now connect Loxone to Node-RED**

Drag and drop a Control In node and click on + to add the Loxone Miniserver

<img width="2110" height="1262" alt="CleanShot 2025-10-15 at 16 54 39@2x" src="https://github.com/user-attachments/assets/00e88bc5-a204-4054-81e2-16ea3cb63c32" />

Type in the IP address of your Loxone miniserver and a Loxone user/password that has rights to the lighting controller you need to control. For testing purposes your admin user is great, but later you want a restricted user.

<img width="2120" height="1158" alt="CleanShot 2025-10-15 at 16 54 55@2x" src="https://github.com/user-attachments/assets/4881b015-f08b-4667-9ed0-f805b0706902" />

Then set the Control In up.
<img width="2110" height="1262" alt="CleanShot 2025-10-15 at 16 54 39@2x" src="https://github.com/user-attachments/assets/9ea604d4-21b3-4616-8ef4-d403ff231dea" />

1 Select the Loxone Room where the Lighting Controller is defined

2 Select the category of Lighting Controller (default is Lighting, duh)

3 Select the Control, this is the Virtual Output Command that's defined on the Lighting Controller on the output!! Check Loxone to be sure Typically it says (VQ) behind the name), do not select any other Loxone object as that just does not work.
<img width="539" height="362" alt="Screenshot 2025-10-15 at 17 05 46" src="https://github.com/user-attachments/assets/9d5c1768-b3e4-42e8-8512-a73c543dfa2e" />

4 If the previous selection was correct you can select color here

5 Name it, use the Hue light name if you want any structure

**The last step**

Connect the Loxone Lighting Controller via a function block to the Hue lamp
<img width="889" height="386" alt="Screenshot 2025-10-15 at 17 10 30" src="https://github.com/user-attachments/assets/7f8fd4b7-1b0f-4039-af21-5bdb1f6fab37" />

Then copy the code from the file functionrgb.js in the block
<img width="1056" height="860" alt="Screenshot 2025-10-15 at 17 15 05" src="https://github.com/user-attachments/assets/7b7a88d8-0291-4601-ac3e-428625fe9d5c" />

This code translates the Loxone RGB values to Hue values. Then Deploy and it should work.

To make it easy you can import the noderedflow.json in Node-RED that sets this up automatically (obviously you need to preinstall your Hue bridge and Loxone server blocks).

---
## The result

Here the Loxone Configurator and the Node-RED interface next to each other. 

https://github.com/user-attachments/assets/dbe60fb4-5000-42b4-bc2e-0631a57e1fa7


---

## 🧠 Script Details – Loxone RGB/Temp → Hue Translation

This Node-RED **Function Node** translates Loxone color commands into valid Philips Hue payloads.  
It supports both **color temperature** (`temp()`) and **HSV color** (`hsv()`) formats, matching how Loxone sends RGB values through virtual outputs.

### 🔹 Supported Input Formats

| Type | Example Input | Description |
|------|----------------|-------------|
| Color Temperature | `temp(75, 4000)` | 75 % brightness, 4000 K white tone |
| HSV Color | `hsv(210, 80, 60)` | Hue = 210°, Saturation = 80 %, Brightness = 60 % |

---

### ⚙️ How the Script Works

1. Receives the Loxone command as a string via `msg.payload`.  
2. Detects whether the input starts with `temp(...)` or `hsv(...)`.  
3. Parses and converts the values:
   - **temp()**
     - Reads brightness + Kelvin.
     - Converts Kelvin to **mireds** (Hue format).
     - Clamps brightness (0–100 %) and color temp (153–500 mireds).
     - Sends `{ on, brightness, colorTemp }`.
     - If brightness = 0 → turns the light **off**.
   - **hsv()**
     - Parses hue (0–360°), saturation (0–100 %), value (0–100 %).
     - Converts **HSV → RGB** internally.
     - Sends `{ on, brightness, rgb, hex }`.
     - If brightness = 0 → turns the light **off**.
4. Invalid input → warning in the Node-RED debug console.

---

### 🧩 Example Output (HueMagic Compatible)

```json
{
  "on": true,
  "brightness": 80,
  "rgb": [64, 128, 255],
  "hex": "#4080ff"
}
