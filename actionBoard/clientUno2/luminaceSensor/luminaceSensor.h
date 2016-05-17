#ifndef LUMINACESENSOR_H
#define LUMINACESENSOR_H
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../equipInterface/equipInterface.h"
#include "../analogInSensor/analogInSensor.h"



class luminaceEquip: public analogInEquip
{
public:
    luminaceEquip(const char* name, uint8_t eId, unsigned char IONum, unsigned char type): analogInEquip(name, eId, IONum, type)
    {

    }
};

#endif