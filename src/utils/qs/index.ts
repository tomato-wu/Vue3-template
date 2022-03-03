
export function stringify(params: any) {
    let formData = new FormData();
    for(let i in params) {
        formData.append(i, params[i])
    }
    return formData;
}