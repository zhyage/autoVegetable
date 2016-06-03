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
    relayEquip(const uint8_t* name, uint8_t eId, uint8_t IONum, uint8_t type): digitOutEquip(name, eId, IONum, type)
    {
    }
};

#endif