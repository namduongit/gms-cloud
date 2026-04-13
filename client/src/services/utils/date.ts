export const formatDate = (dateString: string) => {
    // dateString example: 2000-01-25T22:13:54.839324+07:00
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

export const formatDriveDate = (date: Date | string | number | null | undefined) => {
    if (date === null || typeof date === "undefined") {
        return "--";
    }

    const format = new Date(date);

    const day = format.getDate().toString().padStart(2, "0");
    const month = (format.getMonth() + 1).toString().padStart(2, "0");
    const year = format.getFullYear();

    return `${day} thg ${month}, ${year}`;
}