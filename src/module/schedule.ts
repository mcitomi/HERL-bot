export function scheduleEventBefore(targetTime: Date, minutesBefore: number, callback: () => void) {
    const now = new Date();
    const runTime = new Date(targetTime.getTime() - minutesBefore * 60 * 1000);
    const delay = runTime.getTime() - now.getTime();

    if (delay <= 0) {
        return;
    }

    console.log(`HERL Event loaded! - ${delay / 1000} sec.`);
    setTimeout(callback, delay);
}

// Példa használat:
// const target = new Date("2025-05-09T18:00:00");
// scheduleEventBefore(target, 15, () => {
//     console.log("15 perccel a célidő előtt lefutott az esemény!");
// });
