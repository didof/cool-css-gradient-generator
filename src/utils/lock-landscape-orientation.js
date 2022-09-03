import { isTouchDevice } from './touch';

export function lockLandscape() {
    if (isTouchDevice) {
        const forcer = document.getElementById('lock-landscape-orientation');
        if(window.screen.orientation.type.startsWith('landscape')) {
            forcer.classList.remove('fixed');
            forcer.classList.add('hidden');
        } else {
            forcer.classList.add('fixed');
            forcer.classList.remove('hidden');
        }
        window.screen.orientation.addEventListener('change', event => {
            console.log(event)
        })
    }
}