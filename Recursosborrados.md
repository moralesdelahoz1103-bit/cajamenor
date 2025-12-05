        //Modulo de progreso de la solicitud
        
        <!-- <div class="progress-section" style="margin-top: 24px;">
            <div class="progress-label">Progreso de la solicitud</div>
            <div class="progress-tracker">
                ${crearProgressTracker(solicitud.estado)}
            </div>
        </div> -->



        //Motivos de rechazos
        const motivosComunes = [
            'Falta de presupuesto',
            'Documentación incompleta',
            'No cumple con políticas de la empresa',
            'Monto excede límite autorizado',
            'Centro de costo no disponible',
            'Otro motivo'
        ];