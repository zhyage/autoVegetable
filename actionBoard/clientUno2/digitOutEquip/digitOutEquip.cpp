#include "digitOutEquip.h"

bool digitOutEquip::collectFunction(uint8_t IONum, int32_t *returnVal)
{    
    *returnVal = digitalRead(IONum);   
    return true;
};

void digitOutEquip::driveFunction(uint8_t IONum, int32_t setVal)
{
    digitalWrite(IONum, setVal);
    return;
}