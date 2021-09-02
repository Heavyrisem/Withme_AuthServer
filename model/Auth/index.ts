import global from '../../global';
import DB from '../DB';
import { DefaultError, Device_DB } from '../Types';


export default {
    CreateDevice: (mobileID: string): Promise<Device_DB> => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await DB.GetConnection();
    
                let idx = await db.collection('Devices').findOne<Device_DB>({mobileID: mobileID});
                if (idx) return resolve(idx);
    
                const DeviceData = {
                    code: Math.floor(Math.random() * (999999+1 - 100000)) + 100000,
                    mobileID: mobileID
                }
                
                let ins = await db.collection('Devices').insertOne(DeviceData);
                if (ins.acknowledged) return resolve(DeviceData);
                else throw DefaultError.DB_FAIL;
            } catch (err) {
                return reject(DefaultError.DB_FAIL);
            }
        });
    },
    AuthDevice: (code: number, candleID: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await DB.GetConnection();

                let Device = await db.collection('Devices').findOne<Device_DB>({code: code});
                if (Device) {
                    if (await (await db.collection('Devices').updateOne({code: code}, {$set: { code: -1, candleID: candleID }})).acknowledged) {
                        // Send Socket Event to Client
                        if (global.SOCKET_CLIENTS[Device.mobileID]) {
                            global.SOCKET_CLIENTS[Device.mobileID].emit("Authed", {Authed: true});
                            global.SOCKET_CLIENTS[Device.mobileID].disconnect();
                        }
                        
                        return resolve(true);
                    }
                    else throw DefaultError.DB_FAIL;
                } else return resolve(false);
            } catch (err) {
                return reject(DefaultError.DB_FAIL);
            }
        })
    },
    CheckAuthed: async (mobileID: string): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            try {
                const db = await DB.GetConnection();
    
                const result = await db.collection('Devices').findOne<Device_DB>({mobileID: mobileID});
                if (result && result.code == -1) return resolve(true);
                else {
                    if (result) await db.collection('Devices').deleteOne({mobileID: mobileID});
                    return resolve(false);
                }
            } catch (err) {
                return reject(DefaultError.DB_FAIL);
            }
        })
    }
}