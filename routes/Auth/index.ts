import { Router, Request } from "express";
import middleware from "../../middleware";
import { DefaultError } from "../../model/Types";

import Auth from '../../model/Auth';
import { NUGU_Request, NUGU_Response } from "../Types";

const router = Router();

router.use(((req, res, next) => {
    console.log(req.url);
    next();
}))

interface register_P {
    mobileID?: string
}
// router.post('/register', middleware.Parser, async (req: Request<any,any,register_P>, res) => {
//     console.log(req.body);
//     if (!req.body.mobileID) return res.send({detail: DefaultError.INVAILD_PARAMS});
    
//     try {
//         let DeviceData = await Auth.CreateDevice(req.body.mobileID);
//         return res.send({result: DeviceData.code});
//     } catch (err) {
//         return res.send({detail: err});
//     }
// })

interface auth_P {
    number?: {
        type: string
        value: string
    }
}
router.post('/auth', middleware.Parser, async (req: Request<any,any,NUGU_Request<auth_P>>, res) => {
    // console.log(req.body);
    console.log(req.body.action.parameters);
    let nuguResponse = new NUGU_Response<{result: string}>({result: "인증이 완료되었습니다."});
    if (req.body.action.parameters.number && req.body.profile) {
        try {
            let AuthResult = await Auth.AuthDevice(Number(req.body.action.parameters.number.value.split('|').join("")), req.body.profile.privatePlay.deviceUniqueId);
            if (!AuthResult) nuguResponse.output.result = "인증에 실패했습니다.";
        } catch (err) {
            let isAuthed = await Auth.CheckAuthed(req.body.profile.privatePlay.deviceUniqueId);
            if (isAuthed) nuguResponse.output.result = "이미 인증된 캔들 입니다."
            
            // nuguResponse.resultCode = err;
            nuguResponse.output.result = "인증 중에 오류가 발생했습니다.";
        }
    } else {
        // nuguResponse.resultCode = DefaultError.INVAILD_PARAMS.toString();
        nuguResponse.output.result = "";
        if (!req.body.action.parameters.number) nuguResponse.output.result += "code ";
        if (!req.body.profile) nuguResponse.output.result += "profile ";
        nuguResponse.output.result += "입력값을 찾을 수 없습니다.";
    }

    return res.send(nuguResponse);
})


router.post('/test', (req, res) => {
    console.log(req.body);
    let d = new NUGU_Response<{result: string}>({result: "속이 파내진 누구 캔들모양 물병이 보이네요"});
    res.send(d.toString());
})


export default router;