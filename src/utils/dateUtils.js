import moment, { min } from 'moment-timezone';

export const utcToLocalDateTimeString = (str)=>{
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTime = moment.utc(str).tz(userTimezone).format('YYYY-MM-DD HH:mm:ss');
    return localTime;
}


export const timeDiffToString = (t1, t2)=>{
    const timeDifference = t1.getTime() - t2.getTime(); // miliseconds
    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hoursLeft = timeDifference % (1000 * 60 * 60 * 24);
    let hours = Math.floor(hoursLeft / (1000 * 60 * 60));
    let minutesLeft = hoursLeft % (1000 * 60 * 60);
    let minutes = Math.floor(minutesLeft / (1000 * 60));

    return(days + " days " + hours + " hours " + minutes + " minutes");
}