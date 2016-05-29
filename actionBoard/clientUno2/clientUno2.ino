#include <EEPROM.h>
#include "simpleTimer/simpleTimer.h"
#include "equipInterface/equipInterface.h"
#include "ethernetHandle/ethernetHandle.h"

#define BOARD_ID_ADDRESS 32


struct equipDef
{
    unsigned char equipType;
    char equipName[16];
    uint8_t equipId;
    unsigned char IONum;
    equip *equipEle;
};

struct sendDataType
{
    byte mac[6];
    uint8_t boardTypeId;
    uint8_t equipId;
    int32_t value;
};

/*equipType equipName equipId IONum equipEle*/
struct equipDef equipList[] = 
{
    {0x02, "temperature_1",     1, 2, 0},
    {0x03, "moisture_1",        2, 2, 0},
    {0x04, "soilMoisture_1",    3, A0, 0},
    {0x05, "luminace_1",        4, A1, 0},
    {0x06, "relay_1",           5, 3, 0},//valve
    {0x06, "relay_2",           6, 4, 0},//fan
    {0x06, "relay_3",           7, 5, 0},//light
    {0x06, "relay_4",           8, 6, 0}//warmer
};

ethernetHandle *ethernetHd = NULL;

struct equipDef *findEquipByEquipId(uint8_t equipId)
{
    uint8_t i = 0;
    for(i = 0; i < sizeof(equipList)/sizeof(struct equipDef); i++)
    {
        if(equipId == equipList[i].equipId)
        {
            return &equipList[i];
        }
    }
    return NULL;
}

void initEquipList()
{
    equipFactory *eFactory = new factory;
    size_t equipNum = sizeof(equipList)/sizeof(struct equipDef);
    for(size_t i = 0; i < equipNum; i++)
    {
        struct equipDef *e = &equipList[i];
        e->equipEle = eFactory->createEquip(e->equipType, e->equipName, e->equipId, e->IONum);
    }
}

struct BoardId
{
    unsigned int boardId;
};

struct BoardId gBoardId = {0};
bool gEmptyBoardId = true;
SimpleTimer timer;

struct DriveData
{
    uint8_t equipId;
    int32_t value;
};


bool sendUDPData(unsigned char *data, size_t length)
{
    ethernetHd->UDPSendPacket(data, length);
    return true;
}


bool sendCollectData(byte *mac, uint8_t boardTypeId, uint8_t equipId, int32_t value)
{
    int i = 0;
    struct sendDataType sendData;
    memcpy(sendData.mac, mac, 6);
    sendData.boardTypeId = 1;
    sendData.equipId = equipId;
    sendData.value = value;
    Serial.println("sssssssssendData");
    Serial.print(" mac : ");
    for(i = 0; i < 6; i++)
    {
        Serial.print(sendData.mac[i], HEX);
    }
    Serial.println("");
    Serial.print("boardTypeId : ");
    Serial.println(sendData.boardTypeId);
    Serial.print("equipId : ");
    Serial.println(sendData.equipId);
    Serial.print("value : ");
    Serial.println(sendData.value);

    return sendUDPData((uint8_t *)(&sendData), sizeof(struct sendDataType));

};


void recvData(/*struct DriveData *driveData*/)
{
    struct DriveData recvMsg;
    uint8_t length = 0;
    length = ethernetHd->UDPrecvPacket((uint8_t *)(&recvMsg));
    if(0 != length)
    {
        Serial.println("###########################");
        Serial.print("recv drive equipId : ");
        Serial.println(recvMsg.equipId);
        Serial.print("value : ");
        Serial.println(recvMsg.value);
        struct equipDef *driveEquip = findEquipByEquipId(recvMsg.equipId);
        if(NULL != driveEquip)
        {
            driveEquip->equipEle->driveFunction(driveEquip->IONum, recvMsg.value);
        }
    }
    

    //return true;
}

// void driveBoardEquip()
// {
//     static int setValue = 0;
//     if(setValue == 1)
//     {
//         setValue = 0;
//     }
//     else
//     {
//         setValue = 1;
//     }
//     size_t equipNum = sizeof(equipList)/sizeof(struct equipDef);
//     for(size_t i = 0; i < equipNum; i++)
//     {
//         struct equipDef *e = &equipList[i];
//         e->equipEle->driveFunction(e->IONum, setValue, 1000);
//         Serial.print("equip : ");
//         Serial.print(e->equipEle->getEquipName());
//         Serial.print(" setValue : ");
//         Serial.println(setValue);
//         Serial.println("---------------------------------");
//         //delay(1000);
//         //e->equipEle->driveFunction(2, 66, 1000);
//     }
// }

void collectAndSendBoardData()
{
    static size_t currentNum = 0;
    size_t equipNum = sizeof(equipList)/sizeof(struct equipDef);
    if(currentNum >= equipNum)
    {
        currentNum = 0;
    }

    struct equipDef *e = &equipList[currentNum];
    int returnVal = 0;
    e->equipEle->collectFunction(e->IONum, &returnVal);
    Serial.print("equip : ");
    Serial.print(e->equipEle->getEquipName());
    Serial.print("equipId : ");
    Serial.print(e->equipEle->getEquipId());
    Serial.print(" collectValue : ");
    Serial.println(returnVal);
    Serial.println("---------------------------------");
    Serial.println(millis());
    printf("equip : %s equipId : %d collectValue : %d\r\n", e->equipEle->getEquipName(), e->equipEle->getEquipId(), returnVal);
    //sendData((uint8_t *)(e->equipEle->getEquipName()), 16);
    sendCollectData(ethernetHd->getMacAddress(), 1, e->equipEle->getEquipId(), returnVal);
    currentNum += 1;
}

void setup() 
{
    Serial.begin(9600);
    if(false == createServerSocket())
    {
        Serial.print("error to createServerSocket\r\n");
    }
    if(false == createClientSocket())
    {
        Serial.print("error to createClientSocket\r\b");
    }
    gEmptyBoardId = isEmptyBoardId();
    //ethernetHandle ethernetHd;
    ethernetHd = new(ethernetHandle);
    initEquipList();
    timer.setInterval(5000, collectAndSendBoardData);
    timer.setInterval(1000, recvData);


}

bool isEmptyBoardId()
{
    struct BoardId boardId;
    for(char i = 0; i < sizeof(struct BoardId); i++)
    {
        *((char*)&boardId + i) = EEPROM.read(BOARD_ID_ADDRESS + i);
    }
    if(0 == boardId.boardId)
    {
        Serial.print("empty boardId\r\n");
        return true;
    }
    else
    {
        gBoardId.boardId = boardId.boardId;
        Serial.print("get board : ");
        Serial.println(gBoardId.boardId);
        return false;
    }
}

bool sendEmptyBoardIdInfo()
{
    return true;
}

bool createServerSocket()
{
    return true;
}

bool createClientSocket()
{
    return true;
}

void loop() 
{
    //driveBoardEquip();
    timer.run();
    

}
