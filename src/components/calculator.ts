export class Calculator {

    private readonly OPERATORS = ["+", "-", "*", "/"];
    private readonly DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];



    validateBrackets(tokens: string[]): void {
        // Проверяем на наличие "()""
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i] === '(' && tokens[i + 1] === ')') {
                throw new Error("Пустые скобки недопустимы");
            }
        }

        // Оставляем только скобки
        const onlyBrackets = tokens.filter(token => token === '(' || token === ')');

        // Проверяем баланс скобок
        let balance = 0;
        for (const bracket of onlyBrackets) {
            if (bracket === '(') {
                balance++;
            } else if (bracket === ')') {
                balance--;

                if (balance < 0) {
                    throw new Error("Закрывающая скобка без открывающей");
                }
            }
        }
        if (balance !== 0) {
            throw new Error(`Незакрытых скобок: ${balance}`);
        }
    }

    tokenize(input: string): string[] {
        input = input.replace(/\s/g, "");
        input = input.replace(/,/g, ".");

        const cantBeFirst = ["*", "/", ")", "+"];
        const cantBeLast = [...this.OPERATORS, "("];

        if (input.length === 0) {
            throw new Error("Пустое выражение");
        }

        if (cantBeFirst.includes(input[0]!) || cantBeLast.includes(input[input.length - 1]!)) {
            throw new Error("Некорректное выражение");
        }

        let result: string[] = [];
        let current: string = "";

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            // Если цифра или точка
            if (this.DIGITS.includes(char!)) {
                current += char;
                continue;
            }

            // Сброс current
            if (current !== "") {
                const dotCount = current.split('.').length - 1;
                if (dotCount > 1) {
                    throw new Error(`Некорректное число: ${current}`);
                }
                result.push(current);
                current = "";
            }

            //  Обработка минуса как числа
            if (char === '-') {
                const lastToken = result[result.length - 1];

                if (result.length === 0 || this.OPERATORS.includes(lastToken!) || lastToken === '(') {
                    current = '-';
                    continue;
                }
            }



            // Проверка двух операторов подряд
            if (this.OPERATORS.includes(char!)) {
                const lastToken = result[result.length - 1];

                if (this.OPERATORS.includes(lastToken!)) {
                    throw new Error(`Двойной оператор: ${lastToken}${char}`);
                }

                result.push(char!);
            }
            else if (char === '(' || char === ')') {
                result.push(char);
            }
            else {
                throw new Error(`Неизвестный символ: ${char}`);
            }
        }

        // Сброс последнего числа
        if (current !== "") {
            const dotCount = current.split('.').length - 1;
            if (dotCount > 1) {
                throw new Error(`Некорректное число: ${current}`);
            }
            result.push(current);
        }

        this.validateBrackets(result);
        return result;
    }

    private isNumber(token: string): boolean {
        return !isNaN(Number(token));
    }

    private getPriority(operator: string): number {
        if (operator === '+' || operator === '-') return 1;
        if (operator === '*' || operator === '/') return 2;
        return 0; // для скобок или неизвестных символов
    }

    makeRPN(tokens: string[]): string[] {
        const rpn: string[] = [];
        const stack: string[] = [];

        for (const token of tokens) {
            if (this.isNumber(token)) {
                // Число → сразу в выход
                rpn.push(token);
            }
            else if (token === '(') {
                // Открывающая скобка → в стек
                stack.push(token);
            }
            else if (token === ')') {
                // Закрывающая скобка → вытащить до '('
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    rpn.push(stack.pop()!);
                }
                stack.pop(); // Удалить '('
            }
            else {
                // Оператор
                while (
                    stack.length > 0 &&
                    stack[stack.length - 1] !== '(' &&
                    this.getPriority(stack[stack.length - 1]!) >= this.getPriority(token)
                ) {
                    rpn.push(stack.pop()!);
                }
                stack.push(token);
            }
        }

        // После цикла: вытащить оставшиеся операторы
        while (stack.length > 0) {
            rpn.push(stack.pop()!);
        }

        return rpn;
    }

    evaluateRPN(rpn: string[]): number {
        const stack: number[] = [];

        for (const token of rpn) {
            if (this.isNumber(token)) {
                stack.push(Number(token));
            } else {
                const b = stack.pop()!;
                const a = stack.pop()!;

                if (token === '+') {
                    stack.push(a + b);
                } else if (token === '-') {
                    stack.push(a - b);
                } else if (token === '*') {
                    stack.push(a * b);
                } else if (token === '/') {
                    if (b === 0) {
                        throw new Error("Деление на ноль");
                    }
                    stack.push(a / b);
                } else {
                    throw new Error(`Неизвестный оператор: ${token}`);
                }
            }
        }

        if (stack.length !== 1) {
            throw new Error("Некорректное выражение");
        }

        return stack[0]!;
    }

    calculate(input: string): number {
        const tokens = this.tokenize(input);
        const rpn = this.makeRPN(tokens);
        const result = this.evaluateRPN(rpn);
        return result;
    }
}
