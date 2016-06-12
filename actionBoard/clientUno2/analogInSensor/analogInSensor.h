#ifndef ANALOGINSENSOR_H
#define ANALOGINSENSOR_H
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../equipInterface/equipInterface.h"


class analogInEquip: public equip
{
public:
    analogInEquip(const uint8_t* name, uint8_t eId, uint8_t IO, uint8_t type): equip(name, eId, IO, type)
    {
        pinMode(IO, INPUT);
    }
    bool collectFunction(uint8_t IONum, int32_t *returnVal);
    void driveFunction(uint8_t IONum, int32_t setVal);
};

#endif