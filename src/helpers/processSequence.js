import Api from '../tools/api';
import { tryCatch, prop } from 'ramda';
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);

const composeAsync = (...fns) => (x) =>
    fns.reduceRight((acc, fn) => acc.then(fn), Promise.resolve(x));

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const isLengthLessTwo = length => { return length <= 2 }
    const isLengthMoreTen = length => { return length >= 10 }
    const isNumberLessZero = number => { return number <= 0 }
    const isValidString = str => { return !/^[0-9.]+$/.test(str) }

    const isError = (length, number, str) => {
        if (
            isLengthLessTwo(length) || 
            isLengthMoreTen(length) || 
            isNaN(number) || 
            isNumberLessZero(number) || 
            isValidString(str)
        ) {
            throw new Error('ValidationError');
        }
    }
    const validate = str => {
        writeLog(str)
        str = str.toString()
        const length = getLength(str)
        const number = parseFloat(str)

        isError(length, number, str)
        return str;
    };

    const roundNumber = str => { return Math.round(parseFloat(str)) };

    const getBinary = async num => {
        const { result: binary } = await api.get('https://api.tech/numbers/base', { from: 10, to: 2, number: num })
        return binary
    } 

    const convertToBinary = num => {
        writeLog(num)
        return createSafeFunction(getBinary)(num)
    };

    const logLength = str => {
        writeLog(str)
        return getLength(str)
    };
    const logSquare = num => {
        writeLog(num)
        return getSquare(num)
    };
    const logRest = num => {
        writeLog(num)
        return getRest(num)
    };

    const logAnimal = id => {
        writeLog(id)
        return createSafeFunction(getAnimalById)(id)
    }

    const getAnimalById = async id => {
        const { result: animal } = await api.get(`https://animals.tech/${id}`, {})
        return animal
    };

    const getLength = str => { return str.length }
    const getSquare = num => { return num ** 2 }
    const getRest = num => { return num % 3 }

    const validateAndRound = (str) => {
        return createSafeFunction(compose(
            roundNumber,
            validate
        ))(str);
    }

    const getRestSquareLength = (str) => {
        return compose (
            logRest,
            logSquare,
            logLength
        )(str)
    }

    const logInfo = composeAsync(
        handleSuccess,   
        logAnimal,        
        getRestSquareLength, 
        convertToBinary, 
        validateAndRound  
      );

    const getMessage = prop('message') 
    const logErrorMessage = (error) => { handleError(getMessage(error)) };
    const createSafeFunction = (fn) => async (arg) => {
        try {
          return await fn(arg);
        } catch (error) {
          throw error;  
        }
      };

    const process = (str) => {
        createSafeFunction(logInfo)(str).catch((error) => {
            logErrorMessage(error);
          });
    };

    process(value);
};

export default processSequence;
