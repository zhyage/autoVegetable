#ifndef RELAYDRIVE_H
#define RELAYDRIVE_H
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../equipInterface/equipInterface.h"
#include "../digitOutEquip/digitOutEquip.h"



class relayEquip: public digitOutEquip
{
public:
    relayEquip(const char* name, uint8_t eId, unsigned char IONum, unsigned char type): digitOutEquip(name, eId, IONum, type)
    {
    }
};

#endif