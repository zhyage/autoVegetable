#ifndef SOILMOISTURESENSOR_H
#define SOILMOISTURESENSOR_H
#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif

#include "../equipInterface/equipInterface.h"
#include "../analogInSensor/analogInSensor.h"



class soilMoistureEquip: public analogInEquip
{
public:
    soilMoistureEquip(const uint8_t* name, uint8_t eId, uint8_t IONum, uint8_t type): analogInEquip(name, eId, IONum, type)
    {

    }
};


#endif