export const PASSWORD_STRONG = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,16}/;

export const PASSWORD_MIDDLE = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;

export const PASSWORD_WEEK = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/;

export const EMAIL = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

export const MOBILE_PHONE = /^1(3|4|5|6|7|8|9)\d{9}$/;

export const MOBILE_PHONE_EASY = /^[0-9]{11}$/;
