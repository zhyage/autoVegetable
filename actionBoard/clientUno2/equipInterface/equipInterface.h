#ifndef EQUIPINTERFACE_H
#define EQUIPINTERFACE_H


#if defined(ARDUINO) && (ARDUINO >= 100)
#include <Arduino.h>
#else
#include <WProgram.h>
#endif


class equip
{
public:
    virtual bool collectFunction(unsigned char IONum, int *returnVal) = 0;
    virtual void driveFunction(unsigned char IONum, int setVal, unsigned int timer) = 0;
    equip(const char* name, uint8_t eId, unsigned char IO, unsigned char type): equipName(name), equipId(eId), equipIO(IO), equipType(type)
    {
    }
    const char* getEquipName()
    {
        return equipName;
    }
    const uint8_t getEquipId()
    {
        return equipId;
    }
    unsigned char getEquipIO()
    {
        return equipIO;
    }
    unsigned char getEquipType()
    {
        return equipType;
    }
private:
    const char* equipName;
    uint8_t equipId;
    unsigned char equipIO;
    unsigned char equipType;
};

class equipFactory
{
public:
    virtual equip *createEquip(unsigned char equipType, const char* name, uint8_t equipId, unsigned char IONum) = 0;
};

class factory: public equipFactory
{
public:
    equip *createEquip(unsigned char equipType, const char* name, uint8_t equipId, unsigned char IONum);

};


#endif