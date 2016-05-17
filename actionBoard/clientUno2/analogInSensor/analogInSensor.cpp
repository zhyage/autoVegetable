#include "analogInSensor.h"

bool analogInEquip::collectFunction(unsigned char IONum, int *returnVal)
{    
    *returnVal = analogRead(IONum);   
    return true;
};

void analogInEquip::driveFunction(unsigned char IONum, int setVal, unsigned int timer)
{
    return;
}