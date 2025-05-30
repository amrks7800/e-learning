"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("@upstash/redis");
const config_1 = require("../config/config");
const redis = new redis_1.Redis({
    url: config_1.config.redis.url,
    token: config_1.config.redis.token,
});
exports.default = redis;
