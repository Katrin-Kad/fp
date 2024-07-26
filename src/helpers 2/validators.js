/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

/**
 * Возвращает функцию, которая проверяет, что все предикаты выполняются.
 *
 * @param {Array<Function>} predicates - Массив функций-предикатов.
 * @returns {Function} - Функция, возвращающая true, если все предикаты выполняются.
 */
const allPass = (predicates) => (...args) =>
    predicates.every((predicate) => predicate(...args));
  
/**
* Возвращает функцию, которая проверяет, что хотя бы один предикат выполняется.
*
* @param {Array<Function>} predicates - Массив функций-предикатов.
* @returns {Function} - Функция, возвращающая true, если хотя бы один предикат выполняется.
*/
const anyPass = (predicates) => (...args) =>
    predicates.some((predicate) => predicate(...args));

const isRed = ( color ) => color === 'red';
const isBlue = ( color ) => color === 'blue';
const isGreen = ( color ) => color === 'green';
const isOrange = ( color ) => color === 'orange';
const isWhite = ( color ) => color === 'white';

const isRedStar = ({ star }) => { return isRed(star) };

const isGreenStar = ({ star }) => { return isGreen(star) };
const isGreenSquare = ({ square }) => { return isGreen(square) };
const isGreenTriangle = ({ triangle }) => { return isGreen(triangle) };
const isGreenCircle = ({ circle }) => { return isGreen(circle) };

const isWhiteTriangle = ({ triangle }) => { return isWhite(triangle) };
const isWhiteCircle = ({ circle }) => { return isWhite(circle) };

const isBlueCircle = ({ circle }) => { return isBlue(circle) };

const isOrangeStar = ({ star }) => { return isOrange(star) };
const isOrangeSquare = ({ square }) => { return isOrange(square) };
const isOrangeTriangle = ({ triangle }) => { return isOrange(triangle) };
const isOrangeCircle = ({ circle }) => { return isOrange(circle) };

const isNotWhiteStar = ({ star }) => { return !isWhite(star) };
const isNotWhiteTriangle = ({ triangle }) => {return !isWhite(triangle) }

const isNotRedStar = ({ star }) => { return !isRed(star) };

const filteredShapes = ( shapes, fn ) => { return shapes.filter(fn).length}
const redCount = ( shapes ) => { return filteredShapes(shapes, isRed)};
const blueCount = ( shapes ) => { return filteredShapes(shapes, isBlue)};
const greenCount = ( shapes ) => { return filteredShapes(shapes, isGreen)};

const isRedEqualBlue = (shapes) => {  
    return redCount(shapes) === blueCount(shapes);
};

const isThreeShapesEqualColor = (shapes) => {
    const colors = ['red', 'blue', 'green', 'orange'];
    
    return colors.some((color) => {
      const count = filteredShapes(shapes, (shape) => shape === color);
      return count >= 3;
    });
};

const isTwoShapesGreen = ({ star, square, circle, triangle }) => {
    const shapes = [star, square, circle, triangle];
    return greenCount(shapes) === 2;
};

const isOneShapeRed = ({ star, square, circle }) => {
    const shapes = [star, square, circle];
    return redCount(shapes) === 1;
};

const isSquareTriangleSameColor = ({ square, triangle }) => {
    return square === triangle
};

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = ({ star, square, triangle, circle }) => allPass([
    isRedStar,
    isGreenSquare,
    isWhiteTriangle,
    isWhiteCircle
])({ star, square, triangle, circle });
  
// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = ({ star, square, triangle, circle }) => anyPass([
    allPass([
        isGreenStar,
        isGreenSquare
    ]),
    allPass([
        isGreenTriangle,
        isGreenCircle
    ]),
    allPass([
        anyPass([
            isGreenStar,
            isGreenSquare
        ]),
        anyPass([
            isGreenTriangle,
            isGreenCircle
        ])
    ])
])({ star, square, triangle, circle });

// 3. Количество красных фигур равно количеству синих.
export const validateFieldN3 = ({ star, square, triangle, circle }) => {
    return isRedEqualBlue([star, square, triangle, circle])
};
  
// 4. Синий круг, красная звезда, оранжевый квадрат; треугольник любого цвета.
export const validateFieldN4 = ({star, square, circle}) => allPass([
    isBlueCircle,
    isRedStar,
    isOrangeSquare
])({ star, square, circle });
  
// 5. Три фигуры одного любого цвета, кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = ({ star, square, triangle, circle }) => {
    return isThreeShapesEqualColor([star, square, triangle, circle])
}
  
// 6. Ровно две зеленые фигуры (одна из них — треугольник), плюс одна красная.
export const validateFieldN6 =  ({ star, square, triangle, circle }) => allPass([
    isGreenTriangle,
    isTwoShapesGreen,
    isOneShapeRed
])({ star, square, triangle, circle });
  
// 7. Все фигуры оранжевые.
export const validateFieldN7 = ({ star, square, triangle, circle }) => allPass([
    isOrangeStar,
    isOrangeSquare,
    isOrangeTriangle,
    isOrangeCircle
])({ star, square, triangle, circle });
  
// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = ({ star }) => allPass([
    isNotRedStar,
    isNotWhiteStar
])({ star });
  
// 9. Все фигуры зеленые.
export const validateFieldN9 = ({ star, square, triangle, circle }) => allPass([
    isGreenStar,
    isGreenSquare,
    isGreenTriangle,
    isGreenCircle
])({ star, square, triangle, circle });
  
// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета.
export const validateFieldN10 = ({ square, triangle }) => allPass([
    isSquareTriangleSameColor,
    isNotWhiteTriangle
])({ square, triangle });
  