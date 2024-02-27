export function customStylesQuestoes(){
    return  {
        content: {
            top: '45%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            border: 0,
            background: '#424242',
            marginRight: '-50%',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)',
            width: '50%'
        },
    };
}

export function customStyles(){
    return {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            border: '0',
            background: '#424242',
            marginRight: '-50%',
            borderRadius: '5px',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            overflow: 'auto',
            position: 'fixed'
        },
    };
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}
