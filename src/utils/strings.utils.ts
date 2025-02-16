import { DateTime } from "luxon";

export function generateRandomString(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

export const getCurrentAcademicYear = () => {
    const now = DateTime.local();

    // Assuming academic year starts in August/September
    // Adjust the month (1-12) based on your specific academic calendar
    const academicYearStartMonth = 9; // September

    let currentYear = now.year;

    // If we're before the start month of the academic year,
    // then we're in the previous academic year
    if (now.month < academicYearStartMonth) {
        currentYear -= 1;
    }

    return `${currentYear}/${currentYear + 1}`;
};
