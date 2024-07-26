import Api from '../tools/api';

const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    // Вспомогательные функции
    const validate = str => {
        writeLog(str)

        const length = str.length;
        const number = parseFloat(str);
        if (length <= 2 || length >= 10 || isNaN(number) || number <= 0 || !/^[0-9.]+$/.test(str)) {
            handleError('ValidationError');
        }
        return str;
    };

    const roundNumber = str => { 
        return Math.round(parseFloat(str))
    };

    const getBinary = async num => {
        const { result: binary } = await api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: num })
        return binary
    } 

    const convertToBinary = num => {
        writeLog(num)
        return (getBinary(num))
    };

    const getLength = str => {
        writeLog(str)
        return str.length
    };
    const getSquare = num => {
        writeLog(num)
        return num ** 2
    };
    const getRest = num => {
        writeLog(num)
        return num % 3
    };
    const getAnimalById = async id => {
        writeLog(id)
        const { result: animal } = await api.get(`https://animals.tech/${id}`, {})
        return animal
    };

    // Логика обработки
    const process = async (str) => {
        try {
            // Синхронные этапы обработки
            const validated = compose(
                validate,
                roundNumber
            )(str);

            // Асинхронные этапы обработки
            const binary = await convertToBinary(validated);

            const calc = compose (
                getRest,
                getSquare,
                getLength
            )(binary)

            const animal = await getAnimalById(calc);

            // Успешное завершение обработки
            handleSuccess(animal);
        } catch (error) {
            handleError(error.message);
        }
    };

    process(value);
};

export default processSequence;
