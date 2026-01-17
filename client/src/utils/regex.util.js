export const isEmail = function (email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const isLengthAtLeast = function (value, length) {
    const re = new RegExp(`.{${length},}`);
    return re.test(String(value));
};

export const isLengthAtMost = function (value, length) {
    const re = new RegExp(`.{0,${length}}`);
    return re.test(String(value));
};

export const isPhone = function (value) {
    const re = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
    return re.test(String(value));
};

export const hasUpperCase = function (value) {
    const re = new RegExp(/[A-Z]/);
    return re.test(String(value));
};

export const hasLowerCase = function (value) {
    const re = new RegExp(/[a-z]/);
    return re.test(String(value));
};

export const hasNumber = function (value) {
    const re = new RegExp(/[0-9]/);
    return re.test(String(value));
};

export const hasSpecialChar = function (value) {
    const re = new RegExp(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/);
    return re.test(String(value));
};

export const isInternationalName = function (value) {
    const re = new RegExp(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð '-]+$/u);
    return re.test(String(value));
};

export const splitAtFirstUpperCase = function (value) {
    const re = new RegExp(/(?=[A-Z])/);
    return value.split(re);
};