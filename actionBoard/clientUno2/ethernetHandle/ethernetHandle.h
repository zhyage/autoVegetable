#ifndef ETHERNETHANDLE_H
#define ETHERNETHANDLE_H

#include <SPI.h>         // needed for Arduino versions later than 0018
#include <Ethernet.h>
#include <EthernetUdp.h>         // UDP library from: bjoern@cs.stanford.edu 12/30/2008
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


//byte IPAddress[4] = {0x00, 0x00, 0x00, 0x00};

class ethernetHandle
{
public:
    ethernetHandle();
    void printIPAddress(IPAddress ipAddress);
    size_t UDPrecvPacket(uint8_t *recvMsg);
    bool UDPSendPacket(uint8_t *msg, size_t length);
    byte* getMacAddress()
    {
        return mac;
    };

private:
    byte mac[6] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
    EthernetUDP Udp;
    char recvBuffer[UDP_TX_PACKET_MAX_SIZE];
    IPAddress localIP;
    IPAddress remoteIP;
    uint16_t remotePort;

};


#endif