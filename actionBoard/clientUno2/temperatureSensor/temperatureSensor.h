#ifndef TEMPERATURESENSOR_H
#define TEMPERATURESENSOR_H

#include "../equipInterface/equipInterface.h"
#include <dht11.h>


class temperatureEquip: public equip
{
public:
    temperatureEquip(const char* name, uint8_t eId, unsigned char IONum, unsigned char type): equip(name, eId, IONum, type)
    {
    }
    bool collectFunction(unsigned char IONum, int *returnVal);
    void driveFunction(unsigned char IONum, int setVal);
private:
    dht11 DHT11;    

};

#endif