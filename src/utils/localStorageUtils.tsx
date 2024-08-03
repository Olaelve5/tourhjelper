export const setStorageNotification = (value: boolean) => {
    try {
        localStorage.setItem('hideStorageNotification', value.toString());
    } catch (error) {
        console.error(error);
    }
}

export const getStorageNotification = () => {
    try {
        const value = localStorage.getItem('hideStorageNotification');
        if (value === null) {
            return false;
        }
        return value === 'true';
    } catch (error) {
        console.error(error);
        return false;
    }
}