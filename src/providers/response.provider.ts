interface Responses {
    callbackWithSuccessData(data: Object): Object;
    
    callbackWithErrorMessage(
        errorName?: String,
        errorMessage?: String,
        errorStatusCode?: Number,
    ): Object;
    callbackWithSuccessMessage(message?: String): Object;
    }
    
    export class ResponseProvider implements Responses {
    callbackWithSuccessData(data: Object) {
        return {
            data: {
                statusCode: 200,
                value: data,
            },
        };
    }
    callbackWithErrorMessage(
        errorName?: String,
        errorMessage?: String,
        errorStatusCode?: Number,
    ) {
    return {
        error: {
                statusCode: errorStatusCode,
                name: errorName,
                message: errorMessage,
            },
        };
    }
    callbackWithDefaultError() {
        return {
            error: {
                statusCode: 200,
                name: 'Default',
                message: 'Unknown error occurred while processing data! ',
            },
        };
    }
    callbackWithSuccessMessage(message?: String) {
        return {
            data: {
                statusCode: 200,
                value: message,
            },
        };
    }
}