#include "digitOutEquip.h"

bool digitOutEquip::collectFunction(unsigned char IONum, int *returnVal)
{    
    *returnVal = digitalRead(IONum);   
    return true;
};

void digitOutEquip::driveFunction(unsigned char IONum, int setVal, unsigned int timer)
{
    digitalWrite(IONum, setVal);
    return;
}