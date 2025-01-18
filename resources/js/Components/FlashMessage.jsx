import { useEffect, useState } from 'react';

const FlashMessage = ({ flash }) => {
    const [visible, setVisible] = useState(!!flash.success || !!flash.error);

    useEffect(() => {
        if (flash.success || flash.error) {
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000); 

            return () => clearTimeout(timer); 
        }
    }, [flash]);

    if (!visible) return null;
    return (
        <div
            className={`${flash.success
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'} md-4 rounded border p-4`}
                    >
            <p>{flash.success || flash.error}</p>
        </div>
    );
};
export default FlashMessage;
