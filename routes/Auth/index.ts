import { Router, Request } from "express";
import middleware from "../../middleware";
import { DefaultError } from "../../model/Types";

import Auth from '../../model/Auth';
import { NUGU_Request, NUGU_Response } from "../Types";

const router = Router();

interface register_P {
    mobileID?: string
}
router.post('/register', middleware.Parser, async (req: Request<any,any,register_P>, res) => {
    console.log(req.body);
    if (!req.body.mobileID) return res.send({detail: DefaultError.INVAILD_PARAMS});
    
    try {
        let DeviceData = await Auth.CreateDevice(req.body.mobileID);
        return res.send({result: DeviceData.code});
    } catch (err) {
        return res.send({detail: err});
    }
})

interface update_P {
    number: {
        type: string
        value: string
    }
    code?: number
}
router.post('/update', middleware.Parser, async (req: Request<any,any,NUGU_Request<update_P>>, res) => {
    console.log(req.body);
    let nuguResponse = new NUGU_Response<{result: string}>({result: "인증이 완료되었습니다."});
    if (req.body.action.parameters.code && req.body.profile) {
        try {
            let AuthResult = await Auth.AuthDevice(req.body.action.parameters.code, req.body.profile.privatePlay.deviceUniqueId);
            if (!AuthResult) nuguResponse.output.result = "인증에 실패했습니다.";
        } catch (err) {
            // nuguResponse.resultCode = err;
            nuguResponse.output.result = "오류가 발생했습니다."; 
        }
    } else {
        // nuguResponse.resultCode = DefaultError.INVAILD_PARAMS.toString();
        nuguResponse.output.result = "입력값을 찾을수 없습니다.";
    }

    return res.send(nuguResponse);
})

export default router;