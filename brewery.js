/**
 * Класс для обработки данных о пивоварнях
 */
class Brewery {
    
    /**
     * Создает объект класса на основе объекта распарсенного json от API пивоварен 
     * 
     * @param {object} breweryFromApi 
     */
    constructor( breweryFromApi ) {

        Object.assign( this, breweryFromApi );

    }

    /**
     * Возвращает в формате строки полный адрес
     */
    get getFullAddress() {

        return `${this.postal_code}, ${this.country}, ${this.state}, ${this.city}, ${this.street}`;

    }

}

module.exports = Brewery;
