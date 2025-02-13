declare global {
    interface HTMLElement {
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
    }

    interface Document {
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
    }
}

// Fullscreen toggle function
export function startFullscreen(element: HTMLElement): void {
    const requestFullscreen = 
        element.requestFullscreen || 
        element.webkitRequestFullscreen || 
        element.msRequestFullscreen || 
        element.mozRequestFullScreen;


    if (!document.fullscreenElement) {
        if (requestFullscreen) {
            requestFullscreen.call(element);
        }
    }
}

declare global {
    interface HTMLElement {
        webkitRequestFullscreen?: () => Promise<void>;
        msRequestFullscreen?: () => Promise<void>;
        mozRequestFullScreen?: () => Promise<void>;
    }

    interface Document {
        webkitExitFullscreen?: () => Promise<void>;
        msExitFullscreen?: () => Promise<void>;
        mozCancelFullScreen?: () => Promise<void>;
    }
}

// Fullscreen toggle function
export function endFullscreen(element: HTMLElement): void {

    const exitFullscreen = 
        document.exitFullscreen || 
        document.webkitExitFullscreen || 
        document.msExitFullscreen || 
        document.mozCancelFullScreen;

    if (exitFullscreen) {
        exitFullscreen.call(document);
    }
}