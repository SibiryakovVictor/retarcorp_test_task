
/**
 * Создаёт массив объектов className из свойств объекта srcObject
 */
exports.createArrayFromObjProp = function( className, srcObject ) {

    let arrayObj = [];
    for ( let brewery of Object.values( srcObject ) ) {

        arrayObj.push( new className( brewery ) );

    }

    return arrayObj;
}

/**
 * Создаёт уникальную коллекцию значений свойства key из массива объектов arrayObj 
 */
exports.getUniqueSetValues = function( key, arrayObj ) {
    
    let setValues = new Set;
    arrayObj.forEach( function( obj ) {

        setValues.add( obj[ key ] );

    } );

    return setValues;
}

/**
 * Относит объекты к группам по значениям setValues свойства key
 */
exports.sortDataByKey = function( key, setValues, arrayData ) {
        
    let dataSortedByKey = {};

    for ( let value of setValues ) {

        dataSortedByKey[ value ] = arrayData
            .filter( obj => obj[ key ] === value );

    }

    return dataSortedByKey;
}

/**
 * Применяет к свойствам объекта srcObj, которые должны быть массивом,
 * коллбек handler 
 */
exports.mapObjectProp = function( srcObj, handler ) {
    
    resultObj = {};

    for ( let key of Object.keys( srcObj ) ) {
        resultObj[ key ] = srcObj[ key ].map( handler ); 
    }

    return resultObj;

}

/**
 * Возвращает массив без требуемого значения value свойства key
 */
exports.removeObjWithValue = function( key, value, arrayObj ) {
    
    return arrayObj.filter( obj => obj[ key ] !== value );

}
