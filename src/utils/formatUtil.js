
export function valueToLabel(value, list){
    for(let i = 0; i < list.length; i++){
        let element = list[i];
        if(element.value === value){
            return element.label;
        }
    }
    return '';
}

