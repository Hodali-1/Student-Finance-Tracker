const KEY = 'student_finance:date';

export const load = () => {
    try{
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e){
        console.error('Error laoding dat from localStorage', err);
        return [];
    }
};

export const save = (data) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(data));
    } catch (err){
        console.error('Error saving data to localStorage:', err)
    }
};