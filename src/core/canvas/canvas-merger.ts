export class CanvasMerger {
    private readonly canvases: HTMLCanvasElement[];
    constructor(canvases: HTMLCanvasElement[]) {
        this.canvases = canvases;
    }
    merge(targetCanvas: HTMLCanvasElement, positions: { x: number; y: number }[]) {
        const targetContext = targetCanvas.getContext('2d');
        if (!targetContext) {
            console.error('Unable to get 2D context for target canvas');
            return;
        }
        targetContext.fillStyle = "#ffffff";
        targetContext.fillRect(0, 0, targetCanvas.width, targetCanvas.height);
        positions.forEach((position, index) => {
            const sourceCanvas = this.canvases[index];
            const sourceContext = sourceCanvas.getContext('2d');
            if (!sourceContext) {
                console.error(`Unable to get 2D context for source canvas ${index}`);
                return;
            }
            targetContext.drawImage(sourceCanvas, position.x, position.y);
        });
    }
}