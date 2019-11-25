import { EncuestaInterface } from './encuesta';

export enum EstadoTurno {
    Pendiente = 'Pendiente',
    Cancelado = 'Cancelado',
    Finalizado = 'Finalizado'
}

export interface TurnoInterface {
    UidCliente: string;
    NombreCliente: string;
    UidEspecialista: string;
    NombreEspecialista: string;
    Especialidad: string;
    Fecha: Date;
    Estado: EstadoTurno;
    Encuesta: EncuestaInterface;
    ObservacionesEspecialista: string;
    Consultorio: string;
    ConsultorioId: string;
    CreadoPorCliente: boolean;
    UidRecepcionista: string;
    NombreRecepcionista: string;
}
