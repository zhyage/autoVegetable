#include "moistureSensor.h"

bool moistureEquip::collectFunction(uint8_t IONum, int32_t *returnVal)
{    
    int16_t chk = DHT11.read(IONum);

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

void moistureEquip::driveFunction(uint8_t IONum, int32_t setVal)
{
    return;
}