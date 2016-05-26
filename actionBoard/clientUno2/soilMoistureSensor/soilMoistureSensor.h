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
    soilMoistureEquip(const char* name, uint8_t eId, unsigned char IONum, unsigned char type): analogInEquip(name, eId, IONum, type)
    {

    }
    bool collectFunction(unsigned char IONum, int *returnVal)
    {    
        *returnVal = analogRead(IONum)/10;   
        return true;
    };
};


#endif