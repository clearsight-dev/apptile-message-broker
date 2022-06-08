import { sign, verify } from 'jsonwebtoken';
import moment from 'moment';
// import { config } from 'process';
import { AppConfig } from '../config';

export function createToken(payload: any, expires: number) {
    if (!expires) {
        expires = AppConfig.app.cookie.maxAgeDuration;
    }
    const options = {
        expiresIn: expires,
    };

    return sign(payload, AppConfig.app.secret, options);
}

export function verifyToken(token: string): any {
    try {
        const payload = verify(token, AppConfig.app.secret);
        return payload;
    } catch (ex) {
        return null;
    }
}

export function createEmailVerifyToken(payload: any, expires: number) {
    const now = moment();
    const duration = moment.duration(moment(expires).diff(now));
    const options = {
        expiresIn: duration.asMilliseconds(),
    };
    return sign(payload, AppConfig.app.secret, options);
}

export function verifyEmailVerifyToken(token: string) {
    try {
        const payload = verify(token, AppConfig.app.secret);
        return payload;
    } catch (ex) {
        return null;
    }
}

export function createRecoverPasswordToken(payload: any, expires: number) {
    const now = moment();
    const duration = moment.duration(moment(expires).diff(now));
    const options = {
        expiresIn: duration.asMilliseconds(),
    };
    return sign(payload, AppConfig.app.secret, options);
}

export function verifyRecoverPasswordToken(token: string) {
    try {
        const payload = verify(token, AppConfig.app.secret);
        return payload;
    } catch (ex) {
        return null;
    }
}