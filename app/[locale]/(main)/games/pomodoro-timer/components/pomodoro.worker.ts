/* eslint-disable no-restricted-globals */

// Define the message types
type WorkerMessage =
    | { type: 'START'; duration: number }
    | { type: 'PAUSE' }
    | { type: 'RESET'; duration: number }
    | { type: 'STOP' };

// Define the response types
type WorkerResponse =
    | { type: 'TICK'; timeLeft: number }
    | { type: 'COMPLETE' };

let timerInterval: number | null = null;
let timeLeft = 0;

self.onmessage = (e: MessageEvent<WorkerMessage>) => {
    const { type } = e.data;

    switch (type) {
        case 'START':
            // If a duration is provided (new start), set it. 
            // If resuming (no duration or same duration), just start interval.
            if ('duration' in e.data && typeof e.data.duration === 'number') {
                timeLeft = e.data.duration;
            }

            if (timerInterval) clearInterval(timerInterval);

            timerInterval = self.setInterval(() => {
                if (timeLeft <= 0) {
                    if (timerInterval) clearInterval(timerInterval);
                    self.postMessage({ type: 'COMPLETE' } as WorkerResponse);
                } else {
                    timeLeft--;
                    self.postMessage({ type: 'TICK', timeLeft } as WorkerResponse);
                }
            }, 1000) as unknown as number;
            break;

        case 'PAUSE':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            break;

        case 'RESET':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            if ('duration' in e.data && typeof e.data.duration === 'number') {
                timeLeft = e.data.duration;
                // Verify reset immediately
                self.postMessage({ type: 'TICK', timeLeft } as WorkerResponse);
            }
            break;

        case 'STOP':
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
            break;
    }
};

export { };
