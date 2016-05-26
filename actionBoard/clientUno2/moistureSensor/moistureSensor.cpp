#include "moistureSensor.h"

bool moistureEquip::collectFunction(unsigned char IONum, int *returnVal)
{    
    int chk = DHT11.read(IONum);

    switch (chk)
    {
        case DHTLIB_OK: 
        break;
        case DHTLIB_ERROR_CHECKSUM: 
            Serial.println("Checksum error"); 
            break;
        case DHTLIB_ERROR_TIMEOUT: 
            Serial.println("Time out error"); 
            break;
        default: 
            Serial.println("Unknown error"); 
            break;
    }

    *returnVal = DHT11.humidity;
    return true;
};

void moistureEquip::driveFunction(unsigned char IONum, int setVal)
{
    return;
}