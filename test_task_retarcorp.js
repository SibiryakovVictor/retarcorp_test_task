// URL Сервера:
// http://localhost:8000/

const http = require( 'http' ); //для создания сервера
const https = require( 'https' ); //для запросов к API
const fs = require( 'fs' ); //для отправки html файла


const breweryClass = require( './brewery' );
const handlers = require( './operations' ); //вспомогательные функции

/** 
 * случайно сгенерированные адреса для AJAX-запросов
 * плюс внутри коллбека сервера проверяется метод html-запроса
 * всё это для того, чтобы при запросе на любой URL этого сервера 
 * отдавалась одна страница, в которой будут выведены результаты выполнения задачи
*/
const addrListSortedState = '/tFvhyJE73F9Y7if'; 
const addrTableNoMicro = '/B5nY6phk2AEcE2R';

// адрес API для запроса списка пивоварен
const apiUrlListBreweries = 'https://api.openbrewerydb.org/breweries';

// запуск функции, решающей поставленную задачу
performTask();




async function performTask() {
    /**
     * Перед запуском сервера нужно получить список и выполнить все операции заранее,
     * для этого ждем, пока список не будет получен
     */
    let listBreweries = await doGetRequestAPI( apiUrlListBreweries );

    // На базе списка пивоварен создается массив объектов Brewery
    let objectsBrewery = handlers.createArrayFromObjProp( breweryClass, listBreweries );

    // Создается уникальное множество всех штатов пивоварен
    let setStates = handlers.getUniqueSetValues( 'state', objectsBrewery );

    // На базе множества штатов формируется объект с распределением пивоварен по штатам
    let breweriesSortedState = handlers.sortDataByKey( 'state', setStates, objectsBrewery );

    // Определяются полные адреса пивоварен, распределенных по штатам
    let addressesSortedState = handlers.mapObjectProp( breweriesSortedState, brewery => brewery.getFullAddress );

    // Формируется список пивоварен без микропивоварен
    let breweriesNoMicro = handlers.removeObjWithValue( 'brewery_type', 'micro', objectsBrewery );
    
    // Определяются требуемые данные для фильтрованных пивоварен
    let dataBreweriesNoMicro = breweriesNoMicro.map( function( brewery ) {

        return new function( { id, name, phone, website_url } ) {

            return {
                id, name, phone, website_url,
                'address': brewery.getFullAddress
            };

        }( brewery );

    } );

    /**
     * Запускается сервер, который отправляет html-страницу с решением, а также отвечает
     * на запросы требуемых данных о пивоварнях
     */
    runServer( JSON.stringify( addressesSortedState ), JSON.stringify( dataBreweriesNoMicro ) );

}



/**
 * Запуск сервера, который отвечает 
 * html-страницей с решением 
 * запрашиваемыми данными о пивоварнях
 * 
 * @param {stringJSON} dataSortedStates Адреса пивоварен по штатам
 * @param {stringJSON} dataNoMicro Данные о всех пивоварнях списка, кроме микропивоварен
 */
function runServer( dataSortedStates, dataNoMicro ) {

    http.createServer( function( req, res ) {

        if ( ( req.url === addrListSortedState ) && ( req.method === 'POST') ) {

            res.writeHead( 200, { 'Content-Type': 'application/json' } );
            res.write( dataSortedStates );
            res.end();

        }
        else if ( ( req.url === addrTableNoMicro ) && ( req.method === 'POST') ) {

            res.writeHead( 200, { 'Content-Type': 'application/json' } );
            res.write( dataNoMicro );
            res.end();

        }
        else {

            fs.readFile( "html_template.html", function( err, data ) {

                if ( err ) {
                    res.writeHead( 404 );
                    res.write( 'Not Found' );
                }
                else {
                    res.writeHead( 200, { 'Content-Type': 'text/html' } );
                    res.write( data );
                }

                res.end();

            }  );

        }

    }).listen( 8000 );

}


/**
 * Выполнение запроса через возврат промиса, чтобы использовать async/await
 * и дождаться конца выполнения запроса
 * 
 * @param {string} url URL-адрес для отправки HTTPS GET-запроса
 */
function doGetRequestAPI( url ) {

    return new Promise( ( resolve, reject ) => {

        let resultData = '';

        https.get( url, res => {

            res.on( 'data', data => {
                resultData += data;
            } );

            res.on( 'end', () => {
                resolve( JSON.parse( resultData ) );
            } );

        }  );

    } );
}
