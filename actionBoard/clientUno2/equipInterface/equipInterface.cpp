#include "equipInterface.h"
#include "../temperatureSensor/temperatureSensor.h"
#include "../moistureSensor/moistureSensor.h"
#include "../soilMoistureSensor/soilMoistureSensor.h"
#include "../luminaceSensor/luminaceSensor.h"
#include "../relay/relayDrive.h"

equip * factory::createEquip(unsigned char equipType, const char* name, uint8_t equipId, unsigned char IONum)
{
    if(0x02 == equipType)
    {
        return new temperatureEquip(name, equipId, IONum, equipType);
    }
    if(0x03 == equipType)
    {
        return new moistureEquip(name, equipId, IONum, equipType);
    }
    if(0x04 == equipType)
    {
        return new soilMoistureEquip(name, equipId, IONum, equipType);
    }
    if(0x05 == equipType)
    {
        return new luminaceEquip(name, equipId, IONum, equipType);
    }
    if(0x06 == equipType)
    {
        return new relayEquip(name, equipId, IONum, equipType);
    }
}

