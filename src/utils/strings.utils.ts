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

// Function to get current academic year and semester
export const getCurrentAcademicInfo = () => {
    const now = DateTime.local();

    // Assuming academic year starts in September
    const academicYearStartMonth = 9; // September

    let currentYear = now.year;
    let semester = "";

    // If we're before the start month of the academic year,
    // then we're in the previous academic year
    if (now.month < academicYearStartMonth) {
        currentYear -= 1;

        // January is still part of odd semester from previous year
        if (now.month === 1) {
            semester = "Ganjil";
        } else {
            // February to June/July is even semester
            semester = "Genap";
        }
    } else {
        // September to December is odd semester
        semester = "Ganjil";
    }

    return {
        tahunAkademik: `${currentYear}/${currentYear + 1}`,
        semester: semester,
    };
};
