export class StringHelper {
    public static format(...params: any[]): string {
        let allArgs = params;
        let format = allArgs[0];
        let result = format.substring(0, format.length);

        if (allArgs.length === 2 && typeof allArgs[1] === 'object') {
            let obj = allArgs[1];
            for (let prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    result = result.replace('{' + prop + '}', obj[prop]);
                }
            }
        } else {
            let args = allArgs.filter(function (item, i) {
                return i > 0;
            });

            for (let i = 0 ;i < args.length; i++) {
                result = result.replace('{' + i + '}', args[i]);
            }
        }

        return result;

    }
}
