import { DING_SERVER_AUTHCODE } from '../config/server.config';
import { ResponseBase } from '../base/response.base';
import LogService from '../modules/LogService';
import LaunchService from './LaunchService';

const launchService = new LaunchService();

class DingService {
    constructor() { }

    /**
     * check 钉钉 临时授权code
     * @param code 钉钉临时授权code
     * @param appkey 当前微应用的appkey
     */
    public async CheckTempCode(code: string, appkey: string, logger: LogService) {
        try {
            // 1. 检查火箭发射准备
            if (!code) return new ResponseBase(code, 400, `请求的code非常糟糕`);
            if (!appkey) return new ResponseBase(appkey, 400, `请求的appkey非常糟糕`);

            // 2. 火箭发射，内部2阶段发射
            const sbres = await this._launch(code, appkey);
            if (!sbres) return new ResponseBase(null, 132500, 'DingCode网络异常[21]');

            // 3. 火箭接收成功
            const { status, data } = sbres;

            if (status !== 200) return new ResponseBase(data, status, sbres.statusText);

            if (!data) return new ResponseBase(data, 132500, '无效的钉钉Response[029]');

            if (data.errcode !== 0) return new ResponseBase(data, data.errcode, data.errmsg);

            return new ResponseBase(data);
        } catch (error) {
            console.error(error);
            return new ResponseBase(null, 132500, 'DingCode网络异常[38]');
        }
    }

    /**
     * 火箭发射
    */
    private async _launch(code: string, appkey: string) {
        const reqConfig = {
            method: 'get',
            url: `${DING_SERVER_AUTHCODE}/${code}`,
            headers: { 'appKey': appkey }
        };
        const sbres = await launchService.launch(reqConfig);
        return sbres;
    }

}

export default DingService;
