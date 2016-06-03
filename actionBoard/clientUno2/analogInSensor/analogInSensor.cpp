#include "analogInSensor.h"

bool analogInEquip::collectFunction(uint8_t IONum, int32_t *returnVal)
{    
    *returnVal = analogRead(IONum)*100/1024;   
    return true;
};

void analogInEquip::driveFunction(uint8_t IONum, int32_t setVal)
{
    return;
}