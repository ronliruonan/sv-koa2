import Koa, { ParameterizedContext } from 'koa';
import ApiDingCode from './api/Api-DingCode';
import LogService from './modules/LogService';
import { LISTEN_PORT } from './config/server.config';

const app = new Koa();
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
app.use(cors());
app.use(bodyParser());
app.use(router.routes());

app.listen(LISTEN_PORT, () => {
    console.log(`[工作进程 ${process.pid}] starting at ${LISTEN_PORT} on ${new Date().toLocaleString()}`);
});

router.get('/', async (ctx: ParameterizedContext) => { ctx.body = { 'Hello': 'World!' }; });

router.get('/auth/duid/:dinguid', async (ctx: ParameterizedContext) => {
    const logger = new LogService();
    logger.push(`1. 进入地址 ${ctx.request.url}`);
    try {
        const { dinguid } = ctx.params;

        logger.push(`2. 请求参数 ${dinguid}`);

        logger.push(`3. 发起请求`);
        const apiDingUIDTime = new Date();

        const api = new ApiDingCode();
        const resApi = await api.apiDingUID(dinguid, logger);

        logger.methodTimeEnd('apiDingUID', apiDingUIDTime);
        logger.push(`4. 返回结构 ${logger.objToStr(resApi)} `);

        logger.info();
        ctx.body = resApi;
    } catch (error) {
        console.error(error);
        logger.endErr();
        ctx.body = { errcode: 1111, errmsg: 1111 };
    }
});

router.get('/auth/dcode/:dingcode', async (ctx: ParameterizedContext) => {
    const logger = new LogService();
    logger.push(`1. 进入地址 ${ctx.request.url}`);
    try {
        const
            { dingcode } = ctx.params,
            { appkey } = ctx.req.headers;

        const singleAppkey: string = appkey.toString();

        logger.push(`2. 请求参数 appkey:${singleAppkey} dingcode:${dingcode}`);
        logger.push(`3. 发起请求 钉钉集成`);
        const apiDingUIDTime = new Date();

        const api = new ApiDingCode();
        const resApi = await api.apiDingCode(dingcode, singleAppkey, logger);

        logger.methodTimeEnd('apiDingCode', apiDingUIDTime);
        logger.push(`4. 返回结构 ${logger.objToStr(resApi)}`);

        if (resApi.errcode !== 0) return ctx.body = resApi;

        const { result: { userid: dinguid } } = resApi;

        logger.push(`5. 发起请求 token`);
        const apiDingCodeTime = new Date();

        const resApiDingUID = await api.apiDingUID(dinguid, logger);

        logger.methodTimeEnd('apiDingUID', apiDingCodeTime);
        logger.push(`6. 返回结构 ${logger.objToStr(resApiDingUID)}`);

        logger.info();
        ctx.body = resApiDingUID;
    } catch (error) {
        console.error(error);
        logger.endErr();
        ctx.body = { errcode: 1111, errmsg: 1111 };
    }
});

router.get('/auth/dotnet/duid/:dinguid', async (ctx: ParameterizedContext) => {
    const logger = new LogService();
    logger.push(`1. 进入地址 ${ctx.request.url}`);
    try {
        const { dinguid } = ctx.params;
        logger.push(`2. 请求参数 ${dinguid}`);

        logger.push(`3. 发起请求`);
        const apiOldUserTime = new Date();

        const api = new ApiDingCode();
        const resApi = await api.apiOldUser(dinguid, logger);

        logger.methodTimeEnd('apiOldUser', apiOldUserTime);
        logger.push(`4. 返回结构 ${logger.objToStr(resApi)}`);

        logger.info();
        ctx.body = resApi;
    } catch (error) {
        console.error(error);
        logger.endErr();
        ctx.body = { errcode: 1111, errmsg: 1111 };
    }
});

router.get('/auth/dotnet/dcode/:dingcode', async (ctx: ParameterizedContext) => {
    const logger = new LogService();
    logger.push(`1. 进入地址 ${ctx.request.url}`);
    try {
        const
            { dingcode } = ctx.params,
            { appkey } = ctx.req.headers;

        let singleAppkey: string;
        if (!appkey) {
            singleAppkey = undefined;
        } else {
            singleAppkey = appkey.toString();
        }

        logger.push(`2. 请求参数 appkey:${singleAppkey} dingcode:${dingcode}`);
        logger.push(`3. 发起请求 钉钉集成`);
        const apiDingCodetime = new Date();

        const api = new ApiDingCode();
        const resApi = await api.apiDingCode(dingcode, singleAppkey, logger);

        logger.methodTimeEnd('apiDingCode', apiDingCodetime);
        logger.push(`apiDingCode 结果: ${logger.objToStr(resApi)}`);
        logger.push(`4. 返回结构 ${logger.objToStr(resApi)}`);

        if (resApi.errcode !== 0) return ctx.body = resApi;

        logger.push(`5. 发起请求 token`);
        const { result: { userid: dinguid } } = resApi;

        const apiOldUserTime = new Date();
        const resApiDingUID = await api.apiOldUser(dinguid, logger);
        logger.methodTimeEnd('apiOldUser', apiOldUserTime);
        logger.push(`6. 返回结构 ${logger.objToStr(resApiDingUID)}`);
        logger.info();

        ctx.body = resApiDingUID;
    } catch (error) {
        console.error(error);
        logger.endErr();
        ctx.body = { errcode: 1111, errmsg: 1111 };
    }
});
