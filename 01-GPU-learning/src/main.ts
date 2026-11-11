async function initWebGPU() {

    // 1. Comprobar soporte WebGPU
    if (!navigator.gpu) {
        throw new Error("WebGPU is not supported.");
    }

    // 2. Solicitar adaptador
    const adapter = await navigator.gpu.requestAdapter();

    if (!adapter) {
        throw new Error("No GPUAdapter found.");
    }

    // 3. Crear dispositivo GPU
    const device = await adapter.requestDevice();

    // 4. Obtener canvas
    const canvas = document.querySelector<HTMLCanvasElement>("canvas");

    if (!canvas) {
        throw new Error("Canvas not found.");
    }

    // 5. Obtener contexto WebGPU
    const context = canvas.getContext("webgpu");

    if (!context) {
        throw new Error("WebGPU context not found.");
    }

    // 6. Obtener formato
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

    // 7. Configurar contexto
    context.configure({
        device,
        format: canvasFormat,
        alphaMode: "opaque",
    });

    console.log("WebGPU initialized!");

    return {
        adapter,
        device,
        context,
        canvasFormat,
    };
}

// 8. Ejecutar aplicación
async function main() {

    const { device, context } = await initWebGPU();

    // 9. Crear Command Encoder
    const encoder = device.createCommandEncoder();

    // 10. Crear Render Pass
    const pass = encoder.beginRenderPass({
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                clearValue: {
                    r: 0.1,
                    g: 0.2,
                    b: 0.4,
                    a: 1.0,
                },
                loadOp: "clear",
                storeOp: "store",
            },
        ],
    });

    // 11. Finalizar Render Pass
    pass.end();

    // 12. Finalizar comandos
    const commandBuffer = encoder.finish();

    // 13. Enviar comandos a la GPU
    device.queue.submit([commandBuffer]);

    console.log("GPU rendering completed!");
}

main().catch(console.error);
