export const overflowFormat = (number) => {
    number = number.toString();
    if (number.length > 9) {
        return number.slice(0, 6) + "...";
    }
    return number;
};

export const bigNumber = (number) => {
    number = Number(number);
    if (number >= 10 ** 9) {
        return `${floorFormat(number / 10 ** 9, 2)}B`;
    }
    if (number >= 10 ** 6) {
        return `${floorFormat(number / 10 ** 6, 2)}M`;
    }
    if (number >= 10 ** 3) {
        return `${floorFormat(number / 10 ** 3, 2)}K`;
    }
    if (number == 0) return 0;
    return number.toFixed(3);
};

export const floorFormat = (number, digit) => {
    return Math.floor(number * 10 ** digit) / 10 ** digit;
};

export const floorFloat = (input, digitsAfterDecimalPoint = 1) => {
    if (isNaN(input)) {
        return null;
    }

    const value = parseFloat(input);
    const scale = parseInt(1 + "0".repeat(digitsAfterDecimalPoint));
    return Math.floor(value * scale) / scale;
};

export const numberWithCommas = (x) => {
    if (x < 100) x = Math.floor(x * 100) / 100;
    else x = Math.floor(x);
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const twoDigitNum = (x) => {
    if (x < 10) return `0${x}`;
    else return x.toString();
};

export const formatTime = (milliseconds) => {
    let days = twoDigitNum(Math.floor(milliseconds / 86400000));
    let hours = twoDigitNum(Math.floor((milliseconds % 86400000) / 3600000));
    let minutes = twoDigitNum(Math.floor((milliseconds % 3600000) / 60000));
    let seconds = twoDigitNum(Math.floor((milliseconds % 60000) / 1000));
    return [days, hours, minutes, seconds];
};

var countDecimals = function (value, n) {
    if (!value) return 0;
    if (value % 1 != 0) return value.toString().split(".")[1]?.length || n;
    return 0;
};

export default function (number, n = 3, x = 3, s, c) {
    var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
        num = floorFormat(number, Math.max(0, ~~n)).toString();
    return (c ? num.replace(".", c) : num).replace(new RegExp(re, "g"), "$&" + (s || ","));
}

export const prettifySeconds = (seconds, resolution) => {
    if (seconds < 0) return "Fully Vested";
    if (seconds !== 0 && !seconds) {
        return "";
    }

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    if (resolution === "day") {
        return d + (d == 1 ? " day" : " days");
    }

    const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

    let result = dDisplay + hDisplay + mDisplay;
    if (mDisplay === "") {
        result = result.slice(0, result.length - 2);
    }

    return result;
};
