#include "ethernetHandle.h"

static const uint16_t UDPPORT=8888;

ethernetHandle::ethernetHandle()
{
    // start the Ethernet connection:
    if (Ethernet.begin(mac) == 0) 
    {
        Serial.println("Failed to configure Ethernet using DHCP");
        // no point in carrying on, so do nothing forevermore:
        for (;;)
        {}
    }
    localIP = Ethernet.localIP();
    printIPAddress(localIP);
    Udp.begin(UDPPORT);
}


void ethernetHandle::printIPAddress(IPAddress ipAddress)
{
  Serial.print("My IP address: ");
  for (byte thisByte = 0; thisByte < 4; thisByte++) {
    // print the value of each byte of the IP address:
    Serial.print(ipAddress[thisByte], DEC);
    Serial.print(".");
  }

  Serial.println();
}

size_t ethernetHandle::UDPrecvPacket(uint8_t *recvMsg)
{
  size_t packetSize = Udp.parsePacket();
  if (packetSize) 
  {
    Serial.print("Received packet of size ");
    Serial.println(packetSize);
    Serial.print("From ");
    remoteIP = Udp.remoteIP();
    for (int i = 0; i < 4; i++) {
      Serial.print(remoteIP[i], DEC);
      if (i < 3) {
        Serial.print(".");
      }
    }
    remotePort = Udp.remotePort();
    Serial.print(", port ");
    Serial.println(Udp.remotePort());

    // read the packet into packetBufffer
    Udp.read(recvBuffer, UDP_TX_PACKET_MAX_SIZE);
    Serial.println("Contents:");
    Serial.println(recvBuffer);
    memcpy(recvMsg, recvBuffer, packetSize);
    return packetSize;  
  }
  return 0;
}

bool ethernetHandle::UDPSendPacket(uint8_t *msg, size_t length)
{
    IPAddress rip(10, 0, 0, 1);
    Udp.beginPacket(rip, 8877);
    Udp.write(msg, length);
    Udp.endPacket();
}