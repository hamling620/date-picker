export const getDatePanel = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return {
        year,
        month,
        day,
        hour,
        minute,
        second
    }
}

export const getDate = (year, month, day) => {
    return new Date(year, month, day)
}

export const fomatLt10 = num => {
    return num < 10 ? '0' + num : num
}