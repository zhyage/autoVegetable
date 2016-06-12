#include "analogInSensor.h"

bool analogInEquip::collectFunction(uint8_t IONum, int32_t *returnVal)
{
    int32_t getVal = analogRead(IONum);
    Serial.print("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx : ");
    Serial.println(getVal);    
    *returnVal = getVal*100/1024;   
    return true;
};

void analogInEquip::driveFunction(uint8_t IONum, int32_t setVal)
{
    return;
}