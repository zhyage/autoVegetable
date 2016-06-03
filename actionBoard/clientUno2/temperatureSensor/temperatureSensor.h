#ifndef TEMPERATURESENSOR_H
#define TEMPERATURESENSOR_H

#include "../equipInterface/equipInterface.h"
#include <dht11.h>


class temperatureEquip: public equip
{
public:
    temperatureEquip(const uint8_t* name, uint8_t eId, uint8_t IONum, uint8_t type): equip(name, eId, IONum, type)
    {
    }
    bool collectFunction(uint8_t IONum, int32_t *returnVal);
    void driveFunction(uint8_t IONum, int32_t setVal);
private:
    dht11 DHT11;    

};

#endif