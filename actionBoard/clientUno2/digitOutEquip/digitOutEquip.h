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
    digitOutEquip(const uint8_t* name, uint8_t eId, uint8_t IO, uint8_t type): equip(name, eId, IO, type)
    {
        pinMode(IO, OUTPUT);
    }
    bool collectFunction(uint8_t IONum, int32_t *returnVal);
    void driveFunction(uint8_t IONum, int32_t setVal);
};

#endif