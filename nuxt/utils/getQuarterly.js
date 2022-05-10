
/**
 * 
 * @param {Date|string|number} datetime
 */
export function getQuarterly(datetime) {
    var _date = datetime

    if (typeof datetime === "string" || !Number.isNaN(Number(datetime))) {
        _date = new Date(datetime)
    }

    if (!(_date instanceof Date)) {
        throw new Error("No valid date")
    }

    let month = _date.getMonth() + 1
    
    let quarterly = Math.floor((month-1)/3)+1;
    return quarterly
}