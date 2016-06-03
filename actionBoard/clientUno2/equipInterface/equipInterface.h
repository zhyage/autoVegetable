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
    virtual bool collectFunction(uint8_t IONum, int32_t *returnVal) = 0;
    virtual void driveFunction(uint8_t IONum, int32_t setVal) = 0;
    equip(const uint8_t* name, uint8_t eId, uint8_t IO, uint8_t type): equipName(name), equipId(eId), equipIO(IO), equipType(type)
    {
    }
    const uint8_t* getEquipName()
    {
        return equipName;
    }
    const uint8_t getEquipId()
    {
        return equipId;
    }
    uint8_t getEquipIO()
    {
        return equipIO;
    }
    uint8_t getEquipType()
    {
        return equipType;
    }
private:
    const uint8_t* equipName;
    uint8_t equipId;
    uint8_t equipIO;
    uint8_t equipType;
};

class equipFactory
{
public:
    virtual equip *createEquip(uint8_t equipType, const uint8_t* name, uint8_t equipId, uint8_t IONum) = 0;
};

class factory: public equipFactory
{
public:
    equip *createEquip(uint8_t equipType, const uint8_t* name, uint8_t equipId, uint8_t IONum);

};


#endif