export const emitEvent = (socketProvider: any, event: string, eventBody: any) => {
    socketProvider.emit(event, { ...eventBody });
}