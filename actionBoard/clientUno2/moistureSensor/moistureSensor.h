#ifndef MOISTURESENSOR_H
#define MOISTURESENSOR_H

#include "../equipInterface/equipInterface.h"
#include <dht11.h>


class moistureEquip: public equip
{
public:
    moistureEquip(const char* name, uint8_t eId, unsigned char IONum, unsigned char type): equip(name, eId, IONum, type)
    {
    }
    bool collectFunction(unsigned char IONum, int *returnVal);
    void driveFunction(unsigned char IONum, int setVal, unsigned int timer);
private:
    dht11 DHT11;
};

#endif