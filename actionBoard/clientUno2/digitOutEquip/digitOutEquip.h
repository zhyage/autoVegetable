#ifndef DIGITOUTEQUIP_H
#define DIGITOUTEQUIP_H
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../equipInterface/equipInterface.h"


class digitOutEquip: public equip
{
public:
    digitOutEquip(const char* name, uint8_t eId, unsigned char IO, unsigned char type): equip(name, eId, IO, type)
    {
        pinMode(IO, OUTPUT);
    }
    bool collectFunction(unsigned char IONum, int *returnVal);
    void driveFunction(unsigned char IONum, int setVal, unsigned int timer);
};

#endif